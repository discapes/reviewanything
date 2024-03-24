import { Review } from './db';

export function saveReview({ subject, text }: { subject: string; text: string }) {
	if (
		!subject?.length ||
		!text?.length ||
		!subject.match(/^[a-zA-Z0-9 ]*$/) ||
		subject.length > 40 ||
		text.length > 5000 ||
		subject.length < 1 ||
		text.length < 1
	)
		return { error: 'Invalid inputs' };
	Review.insert({ author: 'anonymous', subject: subject.toLowerCase(), text });
}
