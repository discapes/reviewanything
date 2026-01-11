import { sql, eq, and, desc } from 'drizzle-orm';
import { getDb, reviews, likes, type ReviewWithLikes } from './db';

export async function getReviews({
	userUuid,
	subject,
	onlyLiked = false
}: {
	userUuid?: string;
	subject?: string;
	onlyLiked?: boolean;
}): Promise<Array<ReviewWithLikes>> {
	const db = getDb();

	// Build the query using raw SQL for complex JOINs and aggregations
	// This mirrors the original TypeORM query structure
	const result = await db.execute<ReviewWithLikes>(sql`
		SELECT
			r.date as date,
			r.subject as subject,
			r.text as text,
			r.uuid as uuid,
			COUNT(l2.review_uuid)::int AS total_likes
			${userUuid && !onlyLiked ? sql`, CASE WHEN l.user_uuid IS NOT NULL THEN true ELSE false END AS is_liked` : sql``}
		FROM reviewanything.review r
		${userUuid ? sql`LEFT JOIN reviewanything."like" l ON l.review_uuid = r.uuid AND l.user_uuid = ${userUuid}` : sql``}
		LEFT JOIN reviewanything."like" l2 ON l2.review_uuid = r.uuid
		WHERE 1=1
			${subject ? sql`AND r.subject = ${subject}` : sql``}
			${onlyLiked && userUuid ? sql`AND l.user_uuid = ${userUuid}` : sql``}
		GROUP BY r.date, r.subject, r.text, r.uuid
			${userUuid && !onlyLiked ? sql`, l.user_uuid` : sql``}
		ORDER BY r.date DESC
	`);

	const rows = result.rows as ReviewWithLikes[];

	// For onlyLiked queries, all results are liked by definition
	if (onlyLiked) {
		rows.forEach((r) => (r.is_liked = true));
	}

	return rows;
}
