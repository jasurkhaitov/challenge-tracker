import { useState } from 'react'
import ChallengeForm from './ChallengeForm'
import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

const Create = () => {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const createChallenge = useMutation(api.challenges.createChallenge)
	const ensureUser = useMutation(api.users.ensureUser)
	const { user } = useUser()

	const convexUser = useQuery(
		api.users.getUserByClerkId,
		user?.id ? { clerkId: user.id } : 'skip'
	)

	console.log(convexUser)

	const handleSubmit = async (formData: {
		name: string
		goal: string
		category: string
		color: string
	}) => {
		if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
			toast.error('User not authenticated')
			return
		}

		setIsSubmitting(true)

		try {
			const convexUserData = await ensureUser({
				clerkId: user.id,
				email: user.primaryEmailAddress.emailAddress,
			})

			if (!convexUserData?._id) {
				toast.error('Failed to create user')
				return
			}

			await createChallenge({
				userId: convexUserData._id,
				name: formData.name,
				goal: formData.goal,
				category: formData.category,
				color: formData.color,
			})

			toast.success('Challenge created successfully!')
		} catch (error) {
			console.error('Failed to create challenge:', error)
			if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error('Something went wrong')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='max-w-lg m-auto bg-card p-5 sm:p-7 rounded-xl shadow'>
			<h2 className='text-2xl mb-1 font-bold'>
				Create New Challenge
			</h2>
			<p className='text-muted-foreground  text-md'>
				Set up a long-term challenge to achieve your goals
			</p>
			<div className='mt-5 pt-5 border-t'>
				<ChallengeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</div>
		</div>
	)
}

export default Create