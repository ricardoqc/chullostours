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
