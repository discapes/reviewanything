import { saveReview } from '$lib/server';
import { Like, Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';

export const actions: Actions = {
	async sendreview({ request }) {
		const data = await request.formData();
		const { subject, text } = Object.fromEntries(data.entries()) as Record<string, string>;
		return saveReview({ subject, text });
	},
	async likeReview({ request, cookies }) {
		const data = await request.formData();
		const auth = authenticate(cookies);
		if (!auth)
			return {
				error: 'Not authenticated'
			};
		const { reviewUuid } = Object.fromEntries(data.entries()) as Record<string, string>;
		if (!reviewUuid)
			return {
				error: 'No review uuid'
			};

		const existingLike = await Like.findOne({
			where: {
				review_uuid: reviewUuid,
				user_uuid: auth.sub
			}
		});

		if (existingLike) {
			await existingLike.remove();
		} else {
			await Like.create({
				review_uuid: reviewUuid,
				user_uuid: auth.sub
			}).save();
		}
	}
};

/*
reviews = (await Review.find({
			select: ['date', 'subject', 'text', 'uuid'],
			order: { date: 'DESC' }
		})) as any[];
*/
export const load: PageServerLoad = async ({ params, parent }) => {
	const { userInfo } = await parent();

	let reviews: (Review & { is_liked: boolean })[];
	if (!userInfo) {
		reviews = await reviewsWithLikes();
	} else {
		reviews = await reviewsWithMyLikes(userInfo.sub);
	}
	//console.log(reviews);

	return {
		total: reviews.length,
		reviews: reviews.map(pojoize)
	};
};

function reviewsWithLikes() {
	return Review.createQueryBuilder('r')
		.select([
			`r.date as date`,
			`r.subject as subject`,
			`r.text as text`,
			`r.uuid as uuid`,
			`COUNT(l2.review_uuid) AS total_likes`
		])
		.leftJoin('like', 'l2', 'l2.review_uuid = r.uuid')
		.orderBy('date', 'DESC')
		.groupBy('r.date, r.subject, r.text, r.uuid')
		.getRawMany();
}

function reviewsWithMyLikes(userUuid: string) {
	return Review.createQueryBuilder('r')
		.select([
			`r.date as date`,
			`r.subject as subject`,
			`r.text as text`,
			`r.uuid as uuid`,
			`CASE WHEN l.user_uuid IS NOT NULL THEN true ELSE false END AS is_liked`,
			`COUNT(l2.review_uuid) AS total_likes`
		])
		.leftJoin('like', 'l', `l.review_uuid = r.uuid AND l.user_uuid = :userUuid`, { userUuid })
		.leftJoin('like', 'l2', 'l2.review_uuid = r.uuid')
		.groupBy('r.date, r.subject, r.text, r.uuid, l.user_uuid')
		.orderBy('date', 'DESC')
		.getRawMany();
}
