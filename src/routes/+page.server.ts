import { Review, pojoize } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const reviews = await Review.find();

	return {
		title: `reviewanything! ${reviews.length} reviews so far...`,
		reviews: reviews.map(pojoize)
	};
};
