import { saveReview } from '$lib/server';
import { Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const things = await Review.createQueryBuilder('review')
		.select('review.subject', 'name')
		.addSelect('COUNT(*)', 'count')
		.groupBy('review.subject')
		.orderBy('count', 'DESC')
		.addOrderBy('subject')
		.getRawMany();

	return {
		total: things.length,
		things: things.map(pojoize)
	};
};
