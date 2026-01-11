import { authenticate } from '$lib/server/auth';
import { getReviews } from '$lib/server/reviews';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { thing }, cookies }) => {
	const auth = await authenticate(cookies);
	const reviews = await getReviews({ userUuid: auth?.sub, subject: thing });

	return {
		reviews,
		total: reviews.length,
		thing
	};
};
