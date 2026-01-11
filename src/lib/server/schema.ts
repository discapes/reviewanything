import { pgTable, pgSchema, text, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// Custom schema to avoid public schema permission issues
export const appSchema = pgSchema('reviewanything');

// Review table - matches existing TypeORM entity
export const reviews = appSchema.table(
	'review',
	{
		uuid: uuid('uuid').defaultRandom().notNull(),
		author: text('author').notNull(),
		subject: text('subject').notNull(),
		text: text('text').notNull(),
		date: timestamp('date', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [primaryKey({ columns: [table.uuid, table.author, table.subject, table.text, table.date] })]
);

// Like table - matches existing TypeORM entity
export const likes = appSchema.table(
	'like',
	{
		user_uuid: uuid('user_uuid').notNull(),
		review_uuid: uuid('review_uuid').notNull()
	},
	(table) => [primaryKey({ columns: [table.user_uuid, table.review_uuid] })]
);

// Inferred types from schema
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

// Extended type for queries with computed fields
export type ReviewWithLikes = Review & {
	total_likes: number;
	is_liked?: boolean;
};
