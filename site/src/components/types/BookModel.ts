// export interface Rating {
//     average: number,
//     count: number,
//     sortable: number
// }
//
// export interface EditionsKey {
//     key: string
// }

export interface Author {
    id: number,
    name: string,
    contribution?: string
}

export interface Contribution {
    author: Author,
    contribution: string | null
}

export interface SeriesBook {
    book_id: number,
    position: number,
    title: string,
    rating: number,
    image_url: string,
}

export interface Series {
    books_count: number,
    id: number,
    name: string,
    primary_books_count: number,
    series_books?: SeriesBook[]
}

export interface FeaturedSeries {
    id?: number,
    series?: Series,
    unreleased?: boolean,
    position?: number | null
}

export interface Image {
    height?: number | null,
    id?: number,
    url?: string | null,
    width?: number | null,
    color?: string | null,
    ratio?: number | null
}

export interface BookDocument {
    id: string,
    activities_count?: number,
    contributions?: Contribution[],
    description?: string | null,
    featured_series?: FeaturedSeries | null,
    genres?: string[],
    image: Image | null,
    moods?: string[],
    pages?: number,
    rating?: number,
    ratings_count?: number,
    release_date?: string,
    release_year?: number,
    reviews_count?: number,
    series_names: string[],
    tags?: string[],
    title?: string,
}

// export default interface BookModel {
//     author_name: string[],
//     cover_i?: number,
//     key?: string,
//     title: string,
//     subject?: string[],
//     ratings_average: number,
//     ratings_count: number,
//     readinglog_count: number,
//     want_to_read_count: number,
//     currently_reading_count: number,
//     already_read_count: number,
//     first_publish_year?: number,
//     cover_edition_key?: string,
//     number_of_pages_median?: number,
//     edition_count?: number
// }

// export interface ImageLinks {
//     smallThumbnail: string,
//     thumbnail: string
// }
//
// export interface VolumeInfo {
//     title: string,
//     authors?: string[],
//     publishedDate: string,
//     averageRating?: number,
//     ratingsCount?: number,
//     pageCount?: number,
//     imageLinks?: ImageLinks,
//     categories?: string[]
// }
//
// export default interface BookModel {
//     id: string,
//     selfLink: string,
//     volumeInfo: VolumeInfo
// }
