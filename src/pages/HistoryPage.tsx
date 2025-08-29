import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar"

import Navbar from "@/components/shared/Navbar"
import EmptyHistory from '@/components/history/EmptyHistory'
import HistoryHeader from '@/components/history/HistoryHeader'
import CompletedChallengeCard from '@/components/history/CompletedChallengeCard'
import type { Id } from 'convex/_generated/dataModel'
import { toast } from 'sonner'

export default function HistoryPage() {
	const { user } = useUser()
	const loadingBar = useRef<LoadingBarRef>(null)

	const convexUser = useQuery(
		api.users.getUserByClerkId,
		user?.id ? { clerkId: user.id } : "skip"
	)

	const activeChallenges = useQuery(
		api.challenges.getUserChallenges,
		convexUser?._id ? { userId: convexUser._id } : "skip"
	)

	const completedChallenges = useQuery(
		api.challenges.getCompletedChallenges,
		convexUser?._id ? { userId: convexUser._id } : "skip"
	)

	const deleteCompleted = useMutation(api.challenges.deleteCompletedChallenge)

	const loading = activeChallenges === undefined || completedChallenges === undefined
	useEffect(() => {
		if (loading) {
			loadingBar.current?.continuousStart()
		} else {
			loadingBar.current?.complete()
		}
	}, [loading])

	const hasNoHistory = completedChallenges && completedChallenges.length === 0

	const handleDeleteChallenge = async (id: string) => {
		try {
			await deleteCompleted({ id: id as Id<"challenges"> })
			toast.success("Challenge deleted successfully")
		} catch (err) {
			toast.error("Failed to delete challenge")
			console.error(err)
		}
	}

	return (
		<div className="bg-background px-4">
			<LoadingBar color="#3b82f6" ref={loadingBar} shadow={true} height={3} />

			<Navbar />

			{!loading && hasNoHistory && <EmptyHistory />}

			{!loading && completedChallenges && completedChallenges.length > 0 && (
				<div className="max-w-7xl mx-auto my-30">
					<HistoryHeader num={completedChallenges.length} link={"/dashboard"} />

					<div className="flex flex-col gap-5">
						{completedChallenges.map(challenge => (
							<CompletedChallengeCard
								key={challenge._id}
								challenge={challenge}
								onDelete={handleDeleteChallenge}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
