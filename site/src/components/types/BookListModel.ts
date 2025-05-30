import type {Author} from "@/components/types/BookModel.ts";
import type {TrendingModel} from "@/components/types/TrendingModel.ts";

export interface PreviewBookModel {
    id: number,
    pages: number | null,
    rating: number | null,
    ratings_count: number | null,
    release_year: number | null,
    title: string,
    image_url: string | null,
    tags: string[],
    authors: Author[]
}

export default interface BookListModel {
    id: number,
    name: string,
    description: string | null,
    isPublic: boolean,
    book_ids: number[],
    preview_books?: PreviewBookModel[],
    book_details?: TrendingModel[],
    owner_id: string,
    owner_first_name: string,
    owner_last_name: string | null,
    total_books: number,
    created_at: string,
    last_updated: string | null,
    book_detail_pagination?: BookDetailPagination,
}

export interface BookDetailPagination {
    page: number,
    page_size: number,
    total: number,
    total_pages: number
}
