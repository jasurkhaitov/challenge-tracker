import { Calendar } from "lucide-react"
import { ChallengeGraph } from "@/components/dashboard/graph/ChallengeGraph"
import { Badge } from "@/components/ui/badge"
import { challengeCategories } from '@/constants/challengeCategories'
import ChallengeActions from './ChallengeActions'
import type { Id } from 'convex/_generated/dataModel'

export type ChallengeWithCompletions = {
	_id: Id<'challenges'>
	_creationTime: number
	name: string
	goal: string
	color: string
	category: string
	userId: Id<'users'>
	createdAt: number
	active?: boolean
	completedAt?: number
	completions: string[]
	totalDays: number
	completedDays: number
	missedDays: number
}

interface ChallengeCardProps {
	challenge: ChallengeWithCompletions
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
	const category = challengeCategories.find(c => c.name === challenge.category)
	const CategoryIcon = category?.icon

	const stats = {
		total: challenge.totalDays,
		completion: challenge.completedDays,
		missed: challenge.missedDays
	}

	return (
		<div
			className={`group border rounded-md p-5 transition-all duration-200`}
			style={{ borderColor: challenge.color }}
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					{CategoryIcon && (
						<CategoryIcon className="w-5 h-5" style={{ color: challenge.color }} />
					)}
					<Badge variant="outline" className="text-xs font-medium flex items-center gap-2">
						{challenge.category}
					</Badge>
				</div>

				<div className='flex items-center justify-end gap-1 xs:gap-5'>
					<div className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
						<Calendar className="w-3 h-3" />
						{new Date(challenge.createdAt).toLocaleString()}
					</div>

					<ChallengeActions stats={stats} challengeId={challenge._id} />
				</div>
			</div>

			<div className="mb-4">
				<h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors">
					{challenge.name}
				</h3>
				<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
					{challenge.goal}
				</p>
			</div>

			<ChallengeGraph challenge={challenge} />

			<div className="text-sm text-muted-foreground mt-5 sm:hidden flex items-center gap-1">
				<Calendar className="w-3 h-3" />
				{new Date(challenge.createdAt).toLocaleString()}
			</div>
		</div>
	)
}