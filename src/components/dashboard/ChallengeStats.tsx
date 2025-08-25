import { CheckCircle, Calendar, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ChallengeStats(props: {
	missedDays?: number
	totalDays?: number
	completedDays?: number
}) {
	const completed = props.completedDays ?? 0
	const total = props.totalDays ?? 0
	const missed = props.missedDays ?? 0

	const percent = total > 0
		? Math.round((completed / total) * 100)
		: 0

	return (
		<div className="space-y-6">
			<div>
				<div className="mb-2 flex items-center justify-between text-sm">
					<span className="font-medium text-foreground">Progress</span>
					<span className="text-muted-foreground">{percent}%</span>
				</div>
				<Progress value={percent} className="h-2 rounded-full" />
			</div>

			<div className="grid grid-cols-1  sm:grid-cols-3 gap-3 text-center">
				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<CheckCircle className="h-4 w-4 text-green-500" />
					<p className="font-semibold text-green-500">{completed}</p>
					<p className="text-xs text-muted-foreground">Completed</p>
				</div>

				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<Calendar className="h-4 w-4 text-blue-500" />
					<p className="font-semibold text-blue-500">{total}</p>
					<p className="text-xs text-muted-foreground">Total</p>
				</div>

				<div className="flex justify-center gap-1.5 items-center rounded-lg border border-border p-3">
					<XCircle className="h-4 w-4 text-red-500" />
					<p className="font-semibold text-red-500">{missed}</p>
					<p className="text-xs text-muted-foreground">Missed</p>
				</div>
			</div>
		</div>
	)
}
