import type {Author} from "@/components/types/BookModel.ts";

export interface TrendingModel {
    id: number,
    pages: number | null,
    rating: number | null,
    ratings_count: number | null,
    release_year: number | null,
    reviews_count: number | null,
    title: string,
    image_url: string | null,
    tags: string[],
    authors: Author[]
}