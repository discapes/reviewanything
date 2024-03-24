import { saveReview } from '$lib/server';
import { Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	async sendreview({ request }) {
		const data = await request.formData();
		const { subject, text } = Object.fromEntries(data.entries()) as Record<string, string>;
		return saveReview({ subject, text });
	}
};

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
