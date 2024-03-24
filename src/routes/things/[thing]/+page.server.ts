import { Review, pojoize } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	async sendreview({ request, params: { thing } }) {
		const data = await request.formData();
		const { subject, text } = Object.fromEntries(data.entries()) as any;
		if (!thing?.length || !text?.length) return { error: 'Invalid inputs' };
		Review.insert({ author: 'anonymous', subject: thing.toLowerCase(), text });
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
