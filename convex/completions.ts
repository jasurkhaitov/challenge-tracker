import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const markCompleted = mutation({
	args: {
		challengeId: v.id('challenges'),
		userId: v.id('users'),
		date: v.string(),
		note: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('completions')
			.withIndex('by_challenge_user_date', q =>
				q
					.eq('challengeId', args.challengeId)
					.eq('userId', args.userId)
					.eq('date', args.date)
			)
			.unique()

		if (existing) return

		await ctx.db.insert('completions', {
			...args,
			createdAt: Date.now(),
		})

		const challenge = await ctx.db.get(args.challengeId)
		if (!challenge) return

		const updatedCompleted = [...challenge.completedDays, args.date]
		updatedCompleted.sort()

		let currentStreak = 1
		let longestStreak = 1

		for (let i = 1; i < updatedCompleted.length; i++) {
			const prev = new Date(updatedCompleted[i - 1])
			const curr = new Date(updatedCompleted[i])

			const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
			if (diff === 1) {
				currentStreak += 1
				longestStreak = Math.max(longestStreak, currentStreak)
			} else {
				currentStreak = 1
			}
		}

		await ctx.db.patch(args.challengeId, {
			completedDays: updatedCompleted,
			currentStreak,
			longestStreak,
		})
	},
})
