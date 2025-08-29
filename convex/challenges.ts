import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'

function calculateTotalDays(startDate: Date, endDate: Date): number {
	const MS_PER_DAY = 1000 * 60 * 60 * 24

	const start = new Date(startDate)
	const end = new Date(endDate)

	const dayDiff = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY)

	const startHours = start.getHours()
	const endHours = end.getHours()

	if (endHours < startHours) {
		return dayDiff + 2
	} else {
		return dayDiff + 1
	}
}

type Challenge = {
	_id: Id<'challenges'>
	name: string
	goal: string
	color: string
	category: string
	userId: Id<'users'>
	createdAt: number
	active?: boolean
	completedAt?: number
}

export type CompletedChallengeWithStats = Challenge & {
	stats: {
		totalDays: number
		completedDays: number
		missedDays: number
		startedAt: number
		endedAt: number
		completionRate: number
	}
}

export const deleteCompletedChallenge = mutation({
	args: { id: v.id('challenges') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	},
})

export const getCompletedChallenges = query({
	args: { userId: v.id('users') },
	handler: async (ctx, args): Promise<CompletedChallengeWithStats[]> => {
		try {
			const challenges = await ctx.db
				.query('challenges')
				.withIndex('by_userId', q => q.eq('userId', args.userId))
				.order('desc')
				.collect()

			if (!challenges || challenges.length === 0) {
				return []
			}

			const results: CompletedChallengeWithStats[] = []

			for (const ch of challenges) {
				if (ch.active !== false) continue
				if (!ch.completedAt) continue

				const completions = await ctx.db
					.query('completions')
					.withIndex('by_challenge_user_date', q =>
						q.eq('challengeId', ch._id).eq('userId', args.userId)
					)
					.collect()

				const startDate = new Date(ch.createdAt)
				const endDate = new Date(ch.completedAt)

				const totalDays = calculateTotalDays(startDate, endDate)

				const completedDays = (completions || []).reduce((acc, c) => {
					const d = new Date(c.date + 'T00:00:00.000Z')
					const time = d.getTime()
					return time >= startDate.getTime() && time <= endDate.getTime()
						? acc + 1
						: acc
				}, 0)

				const missedDays = Math.max(0, totalDays - completedDays)
				const completionRate =
					totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

				results.push({
					...ch,
					stats: {
						totalDays,
						completedDays,
						missedDays,
						startedAt: ch.createdAt,
						endedAt: ch.completedAt,
						completionRate,
					},
				})
			}

			return results
		} catch (error) {
			console.error('Error fetching completed challenges:', error)
			return []
		}
	},
})

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
		try {
			const challenges = await ctx.db
				.query('challenges')
				.withIndex('by_userId', q => q.eq('userId', args.userId))
				.order('desc')
				.collect()

			const results: ChallengeWithCompletions[] = []

			const today = new Date()

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

				const totalDays = calculateTotalDays(startDate, today)
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
		} catch (error) {
			console.error('Error fetching user challenges:', error)
			return []
		}
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
