import type {Contribution, FeaturedSeries} from "@/components/types/BookModel.ts";

export interface BasicEditionBook {
    id: number,
    image_url: string
}

export interface ThisEditionBook {
    id: number,
    edition_information?: string | null,
    publisher_name?: string | null,
    publisher_id?: number | null,
    asin?: string | null,
    isbn_10?: string | null,
    isbn_13?: string | null,
    language?: string | null
}

export default interface BookDetailModel {
    id: number,
    image_id: number | null,
    image_url: string | null,
    pages: number,
    rating: number,
    ratings_count: number,
    release_date: string,
    release_year: number,
    reviews_count: number,
    description: string,
    editions_count: number,
    featured_book_series: FeaturedSeries,
    tags: string[],
    title: string,
    contributions: Contribution[],
    editions: BasicEditionBook[],
    this_edition: ThisEditionBook
}

// export interface Rating {
//     average: number,
//     count: number,
//     sortable: number
// }
//
// export interface RatingCount {
//     want_to_read: number,
//     currently_reading: number,
//     already_read: number
// }
//
// export interface Author {
//     personal_name: string,
//     key: string,
//     birth_date: string,
// }
//
// export default interface BookDetailModel {
//     title: string,
//     key: string,
//     description: string,
//     ratings: Rating,
//     covers: number[],
//     subjects: string[],
//     edition_publish_date: string,
//     number_of_pages: number,
//     publishers: string[],
//     counts: RatingCount,
//     authors: Author[]
// }