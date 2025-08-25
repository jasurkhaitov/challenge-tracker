import { format, subDays, startOfWeek, addDays } from "date-fns"
import { useMemo } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { ChallengeStats } from '../ChallengeStats'

type Challenge = {
  _id: Id<"challenges">
  name: string
  color: string
  completions: string[]
  userId: Id<"users">
  createdAt: number

  totalDays?: number
  completedDays?: number
  missedDays?: number
  completionRate?: number
}

export function ChallengeGraph({ challenge }: { challenge: Challenge }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")

  const { weeks, completedSet, missedSet, stats } = useMemo(() => {
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

    const completedDays = days.filter(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      return completed.has(dateStr)
    }).length
    const completionRate = Math.round((completedDays / 365) * 100)

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
      stats: { completedDays, completionRate, days }
    }
  }, [challenge.completions, challenge.createdAt, today, todayStr])


  const markCompleted = useMutation(api.completions.markCompleted)
  const unmarkCompleted = useMutation(api.completions.unmarkCompleted)

  const handleToggle = async () => {
    try {
      if (completedSet.has(todayStr)) {
        await unmarkCompleted({
          challengeId: challenge._id,
          userId: challenge.userId,
          date: todayStr,
        })
        toast.success("Today's completion was cancelled")
      } else {
        await markCompleted({
          challengeId: challenge._id,
          userId: challenge.userId,
          date: todayStr,
        })
        toast.success("Today's achievement is completed")
      }
    } catch (err) {
      console.error("Failed to toggle completion:", err)
      toast.error("Failed to update completion")
    }
  }

  return (
    <>
      <ChallengeStats totalDays={challenge.totalDays} completedDays={challenge.completedDays} missedDays={challenge.missedDays} />

      <div className="mb-5 py-4 rounded-lg graph overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const isDone = completedSet.has(dateStr)
                const isMissed = missedSet.has(dateStr)
                const isInRange = day >= stats.days[0] && day <= today
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

      <div className="flex flex-col xs:flex-row gap-3 items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {completedSet.has(todayStr) ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Completed today!
            </span>
          ) : (
            "Mark today as complete"
          )}
        </div>
        <button
          onClick={handleToggle}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${completedSet.has(todayStr)
            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
            }`}
        >
          {completedSet.has(todayStr) ? "Cancel" : "Done"}
        </button>
      </div>
    </>
  )
}