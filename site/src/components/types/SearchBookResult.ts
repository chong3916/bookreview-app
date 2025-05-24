import type BookHit from "@/components/types/BookModel.ts";

export default interface SearchBookResult {
    hits: BookHit[]
}