import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
      .first()
    return user
  },
})

export const ensureUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
      .first()

    if (existing) return existing

    const id = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
    })

    return await ctx.db.get(id)
  },
})