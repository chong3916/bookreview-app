import type {BookDocument} from "@/components/types/BookModel.ts";
import type {AuthorDocument} from "@/components/types/AuthorModel.ts";

export type SearchResult = | { type: "book"; found: number; hits: BookHit[] } | { type: "author"; found: number; hits: AuthorHit[] };

export interface BookHit {
    document: BookDocument
}

export interface AuthorHit {
    document: AuthorDocument
}
