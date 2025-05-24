export interface Contributor {
    name: string,
    id: number,
    contribution: string
}

export default interface EditionModel {
    book_id: number,
    image_id: number | null,
    image_url: string | null,
    release_date: string | null,
    title: string,
    publisher_name: string | null,
    publisher_id: number | null,
    edition_information: string | null,
    id: number,
    pages: number,
    contributors: Contributor[] | null,
    language: string,
    editions_count: number | null,
    edition_format: string | null
}

