import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar"

import EmptyDashboard from "@/components/dashboard/EmptyDashboard"
import Navbar from "@/components/shared/Navbar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ChallengesList from "@/components/dashboard/ChallengesList"

export default function DashboardPage() {
	const { user } = useUser()
	const loadingBar = useRef<LoadingBarRef>(null)

	const convexUser = useQuery(
		api.users.getUserByClerkId,
		user?.id ? { clerkId: user.id } : "skip"
	)

	const challenges = useQuery(
		api.challenges.getUserChallenges,
		convexUser?._id ? { userId: convexUser._id } : "skip"
	)

	useEffect(() => {
		if (challenges === undefined) {
			loadingBar.current?.continuousStart()
		} else {
			loadingBar.current?.complete()
		}
	}, [challenges])

	return (
		<div className="bg-background px-4">
			<LoadingBar color="#3b82f6" ref={loadingBar} shadow={true} height={3} />

			<Navbar />

			{challenges && challenges.length === 0 && <EmptyDashboard />}

			<div className="max-w-7xl mx-auto my-30">
				{challenges && challenges.length > 0 && (
					<div>
						<div className="mb-8">
							<DashboardHeader
								name={user?.firstName || "there"}
								link={"/create"}
							/>
						</div>

						<ChallengesList challenges={challenges} />
					</div>
				)}
			</div>
		</div>
	)
}