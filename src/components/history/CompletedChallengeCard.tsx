import { useState } from "react"
import { Button } from '@/components/ui/button'
import DeleteChallengeModal from './DeleteChallengeModal'
import { challengeCategories } from '@/constants/challengeCategories'
import { Badge } from '../ui/badge'
import { Calendar, CalendarArrowDown, CalendarArrowUp, ChartNoAxesCombined, CheckCircle, XCircle } from 'lucide-react'

interface CompletedChallengeCardProps {
	challenge: {
		_id: string
		name: string
		goal: string
		category: string
		color: string
		stats: {
			completedDays: number
			totalDays: number
			missedDays: number
			completionRate: number
			startedAt: number
			endedAt: number
		}
	}
	onDelete: (id: string) => void
}

export default function CompletedChallengeCard({ challenge, onDelete }: CompletedChallengeCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	const handleConfirmDelete = () => {
		onDelete(challenge._id)
		setShowDeleteDialog(false)
	}

	const category = challengeCategories.find(c => c.name === challenge.category)
	const CategoryIcon = category?.icon

	const percent = challenge.stats.totalDays > 0
		? Math.round((challenge.stats.completedDays / challenge.stats.totalDays) * 100)
		: 0

	return (
		<div
			className="p-5 rounded-md border bg-card"
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

				<Button
					variant={'destructive'}
					onClick={() => setShowDeleteDialog(true)}
				>
					Delete
				</Button>
			</div>

			<div className="mb-4">
				<h3 className="font-semibold text-lg text-card-foreground mb-1 group-hover:text-primary transition-colors">
					{challenge.name}
				</h3>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{challenge.goal}
				</p>
			</div>

			<div className="mb-2 flex items-center justify-between text-sm">
				<span className="font-medium text-foreground">Progress</span>
				<span className="text-muted-foreground">{percent}%</span>
			</div>

			<div className="mt-4 h-1 w-full rounded-full bg-muted">
				<div
					className="h-1 rounded-full"
					style={{
						width: `${challenge.stats.completionRate}%`,
						backgroundColor: challenge.color,
					}}
				/>
			</div>

			<div className="grid grid-cols-1 my-5 sm:grid-cols-4 gap-3 text-center">
				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<CheckCircle className="h-4 w-4 text-green-500" />
					<p className="font-semibold text-green-500">{challenge.stats.completedDays}</p>
					<p className="text-xs text-muted-foreground">Completed</p>
				</div>

				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<Calendar className="h-4 w-4 text-blue-500" />
					<p className="font-semibold text-blue-500">{challenge.stats.totalDays}</p>
					<p className="text-xs text-muted-foreground">Total Days</p>
				</div>

				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<XCircle className="h-4 w-4 text-red-500" />
					<p className="font-semibold text-red-500">{challenge.stats.missedDays}</p>
					<p className="text-xs text-muted-foreground">Missed</p>
				</div>

				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<ChartNoAxesCombined className="h-4 w-4 text-pink-500" />
					<p className="font-semibold text-pink-500">{percent}%</p>
					<p className="text-xs text-muted-foreground">Progress</p>
				</div>
			</div>

			<div className='flex items-start flex-col gap-1'>
				<div className="flex items-center gap-3">
					<CalendarArrowUp className="text-green-500 w-5 h-5" />
					<div className="flex items-center gap-1">
						<span className="hidden xs:flex text-sm text-muted-foreground">Started  -  </span>
						<span className="font-medium text-foreground">
							{new Date(challenge.stats.startedAt).toLocaleString()}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CalendarArrowDown className="text-red-500 w-5 h-5" />
					<div className="flex items-center gap-1">
						<span className="hidden xs:flex text-sm text-muted-foreground">Ended - </span>
						<span className="font-medium text-foreground">
							{new Date(challenge.stats.endedAt).toLocaleString()}
						</span>
					</div>
				</div>
			</div>


			<DeleteChallengeModal
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onConfirm={handleConfirmDelete}
				challengeName={challenge.name}
			/>
		</div>
	)
}