import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { toast } from "sonner"

type Challenge = {
  _id: Id<"challenges">
  name: string
  color: string
  completions: string[]
  userId: Id<"users">
}

export function ChallengeGraph({ challenge }: { challenge: Challenge }) {
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")

  const days = Array.from({ length: 365 }).map((_, i) =>
    subDays(today, 364 - i)
  )

  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  const startDate = days[0]
  const weekStart = startOfWeek(startDate, { weekStartsOn: 0 })

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

  const completed = new Set(challenge.completions)

  const markCompleted = useMutation(api.completions.markCompleted)
  const unmarkCompleted = useMutation(api.completions.unmarkCompleted)

  const handleToggle = async () => {
    try {
      if (completed.has(todayStr)) {
        await unmarkCompleted({
          challengeId: challenge._id,
          userId: challenge.userId,
          date: todayStr,
        })
        completed.delete(todayStr)
        toast.success("Today's completion was cancelled")
      } else {
        await markCompleted({
          challengeId: challenge._id,
          userId: challenge.userId,
          date: todayStr,
        })
        completed.add(todayStr)
        toast.success("Today's achievement is completed")
      }
    } catch (err) {
      console.error("❌ Failed to toggle completion:", err)
      toast.error("❌ Failed to update completion")
    }
  }

  const totalDays = 365
  const completedDays = days.filter(day => {
    const dateStr = format(day, "yyyy-MM-dd")
    return completed.has(dateStr)
  }).length
  const completionRate = Math.round((completedDays / totalDays) * 100)

  return (
    <>
      <div className="mb-1 text-sm">
        <span className="font-medium">{completedDays}</span> completed days
        {completionRate > 0 && (
          <span className="ml-2">({completionRate}% completion rate)</span>
        )}
      </div>

      <div className="mb-5 p-4 rounded-lg overflow-x-auto graph">
        <div className="flex gap-1 min-w-fit">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const isDone = completed.has(dateStr)
                const isToday = isSameDay(day, today)
                const isInRange = day >= days[0] && day <= today
                const isOutOfRange = day < days[0] || day > today

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    title={
                      isOutOfRange
                        ? ""
                        : `${format(day, "MMM d, yyyy")}${isDone ? " - Completed" : ""}`
                    }
                    className={`
                      w-4 h-4 rounded-sm transition-colors duration-200 cursor-pointer
                      ${isOutOfRange ? "bg-transparent cursor-default" : ""}
                      ${isToday ? "ring-1 ring-blue-400 ring-offset-1" : ""}
                      ${isInRange && !isDone
                        ? "bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        : ""}
                    `}
                    style={
                      {
                        "--challenge-color": challenge.color,
                        backgroundColor: isInRange && isDone ? "var(--challenge-color)" : undefined,
                      } as React.CSSProperties
                    }
                  >
                    {isInRange && isDone && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col xs:flex-row gap-3 items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-600">
          {completed.has(todayStr) ? (
            <span className="flex items-center gap-1 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${completed.has(todayStr)
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md active:scale-95"}
          `}
        >
          {completed.has(todayStr) ? "Cancel Done" : "Mark Done"}
        </button>
      </div>
    </>
  )
}
