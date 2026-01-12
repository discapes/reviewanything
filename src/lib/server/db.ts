import { pgSchema, text, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const appSchema = pgSchema('reviewanything');

export const reviews = appSchema.table(
  'review',
  {
    uuid: uuid('uuid').defaultRandom().notNull(),
    author: text('author').notNull(),
    subject: text('subject').notNull(),
    text: text('text').notNull(),
    date: timestamp('date', { withTimezone: true, mode: "date" }).defaultNow().notNull()
  },
  (table) => [primaryKey({ columns: [table.uuid, table.author, table.subject, table.text, table.date] })]
);

export const likes = appSchema.table(
  'like',
  {
    user_uuid: uuid('user_uuid').notNull(),
    review_uuid: uuid('review_uuid').notNull()
  },
  (table) => [primaryKey({ columns: [table.user_uuid, table.review_uuid] })]
);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

export type ReviewWithLikes = Review & {
  total_likes: number;
  is_liked?: boolean;
};

let db: ReturnType<typeof import('drizzle-orm/postgres-js').drizzle>;

export const setDb = (database: ReturnType<typeof import('drizzle-orm/postgres-js').drizzle>) => {
  db = database;
};

export const getDb = () => db;
