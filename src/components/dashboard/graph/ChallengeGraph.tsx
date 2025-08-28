import { format } from "date-fns"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { ChallengeStats } from '../ChallengeStats'
import { ChallengeHeatmap } from './ChallengeHeatmap'

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
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")
  const completedSet = new Set(challenge.completions)

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
      <ChallengeStats
        totalDays={challenge.totalDays}
        completedDays={challenge.completedDays}
        missedDays={challenge.missedDays}
      />

      <ChallengeHeatmap challenge={challenge} />

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
          {completedSet.has(todayStr) ? "Cancel" : `Complete ${challenge.totalDays}'s day`}
        </button>
      </div>
    </>
  )
}