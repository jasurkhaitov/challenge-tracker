import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
	}).index('by_clerkId', ['clerkId']),

	challenges: defineTable({
		name: v.string(),
		goal: v.string(),
		color: v.string(),
		category: v.string(),
		userId: v.id('users'),
		createdAt: v.float64(),
		active: v.optional(v.boolean()),
		completedAt: v.optional(v.float64()),
	}).index('by_userId', ['userId']),

	completions: defineTable({
		challengeId: v.id('challenges'),
		userId: v.id('users'),
		date: v.string(),
		createdAt: v.float64(),
	})
		.index('by_challengeId', ['challengeId'])
		.index('by_userId', ['userId'])
		.index('by_challenge_user_date', ['challengeId', 'userId', 'date']),
})
