import { saveReview } from '$lib/server';
import { Like, Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';
import { getReviews } from '$lib/server/reviews';

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
export const load: PageServerLoad = async ({ params, cookies }) => {
	const auth = authenticate(cookies);
	let reviews = await getReviews({ userUuid: auth?.sub });

	return {
		total: reviews.length,
		reviews
	};
};
