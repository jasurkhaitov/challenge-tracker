import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
	}).index('by_clerkId', ['clerkId']),

	challenges: defineTable({
		userId: v.id('users'),
		name: v.string(),
		description: v.string(),
		goal: v.string(),
		deadline: v.number(),
		createdAt: v.number(),
		currentStreak: v.number(),
		longestStreak: v.number(),
		completedDays: v.array(v.string()),
		category: v.string(),
		color: v.string(),
		visibility: v.union(v.literal('private'), v.literal('public')),
		parentDocument: v.optional(v.id('challenges')),
	}).index('by_user', ['userId'])
	  .index('by_user_parent', ['userId', 'parentDocument']),

	completions: defineTable({
		challengeId: v.id('challenges'),
		userId: v.id('users'),
		date: v.string(),
		note: v.optional(v.string()),
		createdAt: v.number(),
	}).index('by_challenge_user_date', ['challengeId', 'userId', 'date']),

	templates: defineTable({
		name: v.string(),
		goal: v.string(),
		description: v.string(),
		deadline: v.number(),
		category: v.string(),
		color: v.string(),
	}),
})
