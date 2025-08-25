import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'

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

export const createChallenge = mutation({
	args: {
		userId: v.id('users'),
		name: v.string(),
		goal: v.string(),
		color: v.string(),
		category: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('challenges', {
			...args,
			createdAt: Date.now(),
			active: true,
		})
	},
})

export const getUserChallenges = query({
	args: { userId: v.id('users') },
	handler: async (ctx, args): Promise<ChallengeWithCompletions[]> => {
		const challenges = await ctx.db
			.query('challenges')
			.withIndex('by_userId', q => q.eq('userId', args.userId))
			.collect()

		const results: ChallengeWithCompletions[] = []
		for (const ch of challenges) {
			if (!ch.active) continue

			const completions = await ctx.db
				.query('completions')
				.withIndex('by_challenge_user_date', q =>
					q.eq('challengeId', ch._id).eq('userId', args.userId)
				)
				.collect()

			const completedDays = completions.length

			const startDate = new Date(ch.createdAt)
			startDate.setHours(0, 0, 0, 0)

			const today = new Date()
			today.setHours(0, 0, 0, 0)

			const totalDays =
				Math.floor(
					(today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
				) + 2

			const missedDays = Math.max(0, totalDays - completedDays)

			results.push({
				...ch,
				completions: completions.map(c => c.date),
				totalDays,
				completedDays,
				missedDays,
			})
		}
		return results
	},
})

export const markDayDone = mutation({
	args: {
		challengeId: v.id('challenges'),
		userId: v.id('users'),
		date: v.string(),
	},
	handler: async (ctx, args) => {
		const normalizedDate = args.date.split('T')[0]

		const existing = await ctx.db
			.query('completions')
			.withIndex('by_challenge_user_date', q =>
				q
					.eq('challengeId', args.challengeId)
					.eq('userId', args.userId)
					.eq('date', normalizedDate)
			)
			.unique()

		if (existing) return existing

		return await ctx.db.insert('completions', {
			...args,
			date: normalizedDate,
			createdAt: Date.now(),
		})
	},
})

export const completeChallenge = mutation({
	args: { challengeId: v.id('challenges') },
	handler: async (ctx, args) => {
		const ch = await ctx.db.get(args.challengeId)
		if (!ch || !ch.active) throw new Error('Challenge not active')

		await ctx.db.patch(ch._id, {
			active: false,
			completedAt: Date.now(),
		})

		return await ctx.db.get(ch._id)
	},
})

export const deleteChallenge = mutation({
	args: { id: v.id('challenges') },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id)
	},
})
