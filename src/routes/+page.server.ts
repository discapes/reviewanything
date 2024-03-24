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
	const reviews = await Review.find({
		select: ['date', 'subject', 'text'],
		order: { date: 'DESC' }
	});

	return {
		total: reviews.length,
		reviews: reviews.map(pojoize)
	};
};
