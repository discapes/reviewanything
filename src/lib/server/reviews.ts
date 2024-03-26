import { Like, Review, pojoize } from './db';

export async function getReviews({
	userUuid,
	subject,
	onlyLiked = false
}: {
	userUuid?: string;
	subject?: string;
	onlyLiked?: boolean;
}): Promise<Array<Review>> {
	const qb = Review.createQueryBuilder('r');
	const cols = [
		`r.date as date`,
		`r.subject as subject`,
		`r.text as text`,
		`r.uuid as uuid`,
		`COUNT(l2.review_uuid) AS total_likes`
	];
	const groupBy = ['r.date', 'r.subject', 'r.text', 'r.uuid'];

	if (userUuid) {
		qb.leftJoin('like', 'l', `l.review_uuid = r.uuid AND l.user_uuid = :userUuid`, { userUuid });

		if (onlyLiked) {
			qb.where(`l.user_uuid = :userUuid`, { userUuid });
		} else {
			cols.push(`CASE WHEN l.user_uuid IS NOT NULL THEN true ELSE false END AS is_liked`);
			groupBy.push('l.user_uuid');
		}
	}

	if (subject) {
		qb.where(`r.subject = :subject`, { subject });
	}

	qb.select(cols)
		.leftJoin('like', 'l2', 'l2.review_uuid = r.uuid')
		.groupBy(groupBy.join(', '))
		.orderBy('date', 'DESC');

	let res = await qb.getRawMany();

	if (onlyLiked) res.forEach((r) => (r.is_liked = true));

	return res.map(pojoize);
}
