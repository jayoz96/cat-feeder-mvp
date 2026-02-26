import { Review } from "@/types";

const globalForReviews = globalThis as unknown as { __reviews?: Review[] };
if (!globalForReviews.__reviews) {
  globalForReviews.__reviews = [];
}

function getStore(): Review[] {
  return globalForReviews.__reviews!;
}

export const ReviewService = {
  getByUser(userId: string): Review[] {
    return getStore().filter((r) => r.toUserId === userId);
  },

  getByOrder(orderId: string): Review | null {
    return getStore().find((r) => r.orderId === orderId) ?? null;
  },

  create(review: Omit<Review, "id" | "createdAt">): Review {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    globalForReviews.__reviews = [newReview, ...getStore()];
    return newReview;
  },

  getAverageRating(userId: string): { avg: number; count: number } {
    const reviews = this.getByUser(userId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
  },
};
