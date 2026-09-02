/**
 * Public data access for tours.
 * Implementation lives in src/lib/data (JSON today → CMS/DB later).
 */
export {
  getAllTours,
  getPublishedTours,
  getTourBySlug,
  getDestinations,
  toursRepository,
} from "@/lib/data/tours-repository";
