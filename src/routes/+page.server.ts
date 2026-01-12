import { saveReview } from '$lib/server';
import { getDb, likes } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';
import { getReviews } from '$lib/server/reviews';
import { eq, and } from 'drizzle-orm';

export const actions: Actions = {
  async sendreview({ request }) {
    const data = await request.formData();
    const { subject, text } = Object.fromEntries(data.entries()) as Record<string, string>;
    console.log('Received sendreview action', { subject, text });
    return await saveReview({ subject, text });
  },
  async likeReview({ request, cookies }) {
    const data = await request.formData();
    const auth = await authenticate(cookies);
    if (!auth)
      return {
        error: 'Not authenticated'
      };
    const { reviewUuid } = Object.fromEntries(data.entries()) as Record<string, string>;
    if (!reviewUuid)
      return {
        error: 'No review uuid'
      };

    const db = getDb();

    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.review_uuid, reviewUuid), eq(likes.user_uuid, auth.sub)))
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.review_uuid, reviewUuid), eq(likes.user_uuid, auth.sub)));
    } else {
      await db.insert(likes).values({
        review_uuid: reviewUuid,
        user_uuid: auth.sub
      });
    }
  }
};

export const load: PageServerLoad = async ({ params, cookies }) => {
  const auth = await authenticate(cookies);
  let reviews = await getReviews({ userUuid: auth?.sub });

  return {
    total: reviews.length,
    reviews
  };
};
