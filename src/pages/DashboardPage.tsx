import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Calendar } from "lucide-react"
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar"

import EmptyDashboard from "@/components/dashboard/EmptyDashboard"
import Navbar from "@/components/shared/Navbar"
import { ChallengeGraph } from "@/components/dashboard/ChallengeGraph"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { challengeCategories } from '@/constants/challengeCategories'

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

						<div className="flex flex-col gap-5">
							{challenges.map((ch) => (
								<div
									key={ch._id}
									className={`group border rounded-md p-5 transition-all duration-200`}
									style={{ borderColor: ch.color }}
								>
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">

											{(() => {
												const category = challengeCategories.find(c => c.name === ch.category)
												if (!category) return ch.category
												const Icon = category.icon
												return (
													<>
														<Icon className="w-5 h-5" style={{ color: ch.color }} />
													</>
												)
											})()}
											<Badge variant="outline" className="text-xs font-medium flex items-center gap-2">
												{ch.category}
											</Badge>
										</div>
										<div className="text-xs text-muted-foreground flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											{new Date(ch.createdAt).toLocaleDateString()}
										</div>
									</div>

									<div className="mb-4">
										<h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors">
											{ch.name}
										</h3>
										<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
											{ch.goal}
										</p>
									</div>

									<ChallengeGraph challenge={ch} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
