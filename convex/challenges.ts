import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createChallenge = mutation({
	args: {
		parentDocument: v.optional(v.id('challenges')),
		userId: v.id('users'),
		name: v.string(),
		description: v.string(),
		goal: v.string(),
		deadline: v.number(),
		category: v.string(),
		color: v.string(),
	},
	handler: async (ctx, args) => {
		const createdAt = Date.now()

		await ctx.db.insert('challenges', {
			...args,
			createdAt,
			currentStreak: 0,
			longestStreak: 0,
			completedDays: [],
			visibility: 'private',
		})
	},
})

export const getUserChallenges = query({
	args: { userId: v.id('users') },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('challenges')
			.withIndex('by_user', q => q.eq('userId', args.userId))
			.collect()
	},
})