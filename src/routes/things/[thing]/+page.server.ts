import { saveReview } from '$lib/server';
import { Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	async sendreview({ request, params: { thing } }) {
		const data = await request.formData();
		const { text } = Object.fromEntries(data.entries()) as any;
		return saveReview({ subject: thing, text });
	}
};

export const load: PageServerLoad = async ({ params: { thing } }) => {
	const reviews = await Review.find({
		select: ['date', 'subject', 'text'],
		where: { subject: thing },
		order: { date: 'DESC' }
	});

	return {
		reviews: reviews.map(pojoize),
		total: reviews.length,
		thing
	};
};
