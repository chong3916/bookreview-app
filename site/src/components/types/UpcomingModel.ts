import type {Author} from "@/components/types/BookModel.ts";

export interface UpcomingModel {
    id: number,
    pages: number | null,
    rating: number | null,
    ratings_count: number | null,
    release_date: string | null,
    reviews_count: number | null,
    title: string,
    image_url: string | null,
    tags: string[],
    authors: Author[],
    users_count: number | null
}
