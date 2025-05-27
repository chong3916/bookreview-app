import type {Image} from "@/components/types/BookModel.ts";

export interface AuthorDocument {
    id: string,
    books_count: number | null,
    image: Image | null,
    books: string[],
    series_names: string[],
    alternate_names: string[],
    name: string
}
