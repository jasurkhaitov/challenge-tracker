import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
		description: string
		category: string
		color: string
		deadline: Date
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
				description: formData.description,
				category: formData.category,
				color: formData.color,
				deadline: formData.deadline.getTime(),
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
		<Card>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>
					Create New Challenge
				</CardTitle>
				<p className='text-muted-foreground'>
					Set up a long-term challenge to achieve your goals
				</p>
			</CardHeader>
			<CardContent>
				<ChallengeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</CardContent>
		</Card>
	)
}

export default Create
