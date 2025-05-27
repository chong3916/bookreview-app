export default interface AuthorDetailModel {
    id: number,
    name: string | null,
    bio: string | null,
    books_count: number,
    born_date: string | null,
    born_year: number | null
    death_year: number | null
    death_date: string | null,
    image_url: string | null,
    books: AuthorBookModel[],
    avg_rating: number | null,
    ratings_count: number,
    reviews_count: number,
    users_count: number,
}

export interface AuthorBookModel {
    id: number,
    title: string,
    release_year: number,
    users_count: number,
    users_read_count: number,
    image_url: string | null,
    pages: number | null,
    ratings_count: number,
    rating: number | null
}
