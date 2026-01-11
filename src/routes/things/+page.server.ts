import { getDb, reviews } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { sql, desc, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();

	const things = await db
		.select({
			name: reviews.subject,
			count: sql<number>`COUNT(*)::int`.as('count')
		})
		.from(reviews)
		.groupBy(reviews.subject)
		.orderBy(desc(sql`count`), asc(reviews.subject));

	return {
		total: things.length,
		things
	};
};
