import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const markCompleted = mutation({
	args: {
		challengeId: v.id('challenges'),
		userId: v.id('users'),
		date: v.string(),
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

		if (existing) return existing

		return await ctx.db.insert('completions', {
			...args,
			createdAt: Date.now(),
		})
	},
})

export const unmarkCompleted = mutation({
	args: {
		userId: v.id('users'),
		challengeId: v.id('challenges'),
		date: v.string(),
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

		if (existing) {
			await ctx.db.delete(existing._id)
			return existing._id
		}

		return null
	},
})
