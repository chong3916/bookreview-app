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
    book_detail_pagination?: BookDetailPagination,
    owner_id: string;
}

export interface BookDetailPagination {
    page: number,
    page_size: number,
    total: number,
    total_pages: number
}
