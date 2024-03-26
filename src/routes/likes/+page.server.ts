import { getReviews } from '$lib/server/reviews';
import type { PageServerLoad } from '../$types';
import { authenticate } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const auth = authenticate(cookies);

	if (auth) {
		const reviews = await getReviews({ userUuid: auth.sub, onlyLiked: true });

		return {
			total: reviews.length,
			reviews: reviews
		};
	}
	return {};
};
