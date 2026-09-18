import fs from 'fs';
import path from 'path';

export interface TripAdvisorReview {
  id: string;
  url: string;
  title: string;
  rating: number;
  text: string;
  publishedDate: string;
  travelDate: string;
  tripType: string;
  user: {
    name: string;
    username: string;
    avatar: {
      image: string;
    } | null;
  };
}

export function getAllReviews(): TripAdvisorReview[] {
  const reviewsPath = path.join(process.cwd(), 'data', 'reviews', 'tripadvisor-reviews.json');
  if (!fs.existsSync(reviewsPath)) return [];
  const fileContents = fs.readFileSync(reviewsPath, 'utf8');
  return JSON.parse(fileContents);
}

/**
 * Reseñas cuyo título o texto menciona el patrón dado (ej. /machu\s*picchu/i), ordenadas por
 * más recientes. Cae de vuelta a las más recientes en general si no hay suficientes para `limit`.
 */
export function getReviewsMatching(pattern: RegExp, limit = 6): TripAdvisorReview[] {
  const all = getAllReviews();
  const byDateDesc = (a: TripAdvisorReview, b: TripAdvisorReview) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();

  const matching = all.filter((r) => pattern.test(r.title) || pattern.test(r.text)).sort(byDateDesc);
  if (matching.length >= limit) return matching.slice(0, limit);

  const rest = all
    .filter((r) => !matching.some((m) => m.id === r.id))
    .sort(byDateDesc);
  return [...matching, ...rest].slice(0, limit);
}
