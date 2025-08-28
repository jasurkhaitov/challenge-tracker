import { format, subDays, startOfWeek, addDays } from "date-fns"
import { useMemo } from "react"
import type { Id } from "../../../../convex/_generated/dataModel"

type Challenge = {
	_id: Id<"challenges">
	name: string
	color: string
	completions: string[]
	userId: Id<"users">
	createdAt: number
}

interface ChallengeHeatmapProps {
	challenge: Challenge
}

export function ChallengeHeatmap({ challenge }: ChallengeHeatmapProps) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const today = new Date()
	const todayStr = format(today, "yyyy-MM-dd")

	const { weeks, completedSet, missedSet } = useMemo(() => {
		const days = Array.from({ length: 365 }, (_, i) => subDays(today, 364 - i))
		const completed = new Set(challenge.completions)

		const createdAtStr = format(new Date(challenge.createdAt), "yyyy-MM-dd")
		const missed = new Set<string>()

		days.forEach(day => {
			const dateStr = format(day, "yyyy-MM-dd")
			if (dateStr >= createdAtStr && dateStr < todayStr && !completed.has(dateStr)) {
				missed.add(dateStr)
			}
		})

		const weeks: Date[][] = []
		let currentWeek: Date[] = []

		const startDate = days[0]
		const weekStart = startOfWeek(startDate, { weekStartsOn: 2 })

		for (let i = 0; i < 7; i++) {
			const day = addDays(weekStart, i)
			if (day < startDate) {
				currentWeek.push(day)
			} else {
				break
			}
		}

		days.forEach(day => {
			if (currentWeek.length === 7) {
				weeks.push(currentWeek)
				currentWeek = []
			}
			currentWeek.push(day)
		})

		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				const lastDay = currentWeek[currentWeek.length - 1]
				currentWeek.push(addDays(lastDay, 1))
			}
			weeks.push(currentWeek)
		}

		return {
			weeks,
			completedSet: completed,
			missedSet: missed,
			stats: { days }
		}
	}, [challenge.completions, challenge.createdAt, today, todayStr])

	return (
		<div className="mb-5 py-4 rounded-lg graph overflow-x-auto">
			<div className="flex gap-1 min-w-fit">
				{weeks.map((week, weekIndex) => (
					<div key={weekIndex} className="flex flex-col gap-1">
						{week.map((day, dayIndex) => {
							const dateStr = format(day, "yyyy-MM-dd")
							const isDone = completedSet.has(dateStr)
							const isMissed = missedSet.has(dateStr)
							const isInRange = day >= subDays(today, 364) && day <= today
							const isOutOfRange = !isInRange

							const baseClasses = "w-4 h-4 rounded-sm transition-colors duration-150"
							const interactionClasses = isOutOfRange
								? "cursor-default opacity-0"
								: "cursor-pointer"

							let stateClasses = ""
							let backgroundColor = undefined

							if (isInRange) {
								if (isDone) {
									backgroundColor = challenge.color
								} else if (isMissed) {
									stateClasses = "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 border-2 border-red-500"
								} else {
									stateClasses = "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
								}
							}

							return (
								<div
									key={`${weekIndex}-${dayIndex}`}
									title={isOutOfRange ? "" : `${format(day, "MMM d, yyyy")}${isDone ? " - Completed" : ""}`}
									className={`${baseClasses} ${interactionClasses} ${stateClasses} flex items-center justify-center`}
									style={backgroundColor ? { backgroundColor } : undefined}
								>
									{isInRange && isDone && (
										<svg
											className="w-2 h-2 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</div>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}