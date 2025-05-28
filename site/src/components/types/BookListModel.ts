export default interface BookListModel {
    id: number,
    name: string,
    description: string | null,
    isPublic: boolean,
    book_ids: number[]
}
