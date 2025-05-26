import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = (current: number, total: number): (number | string)[] => {
        const delta = 1;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];
        let left = current - delta;
        let right = current + delta;

        if (left < 2) {
            left = 2;
            right = Math.min(left + 2, total - 1);
        }
        if (right >= total) {
            right = total - 1;
            left = Math.max(right - 2, 2);
        }

        range.push(1);
        for (let i = left; i <= right; i++) {
            if (i > 1 && i < total) range.push(i);
        }
        if (total > 1) range.push(total);

        for (let i = 0; i < range.length; i++) {
            if (i > 0) {
                const prev = range[i - 1] as number;
                const curr = range[i] as number;
                if (curr - prev > 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(range[i]);
        }

        return rangeWithDots;
    };

    const pagesToShow = getPageNumbers(currentPage, totalPages);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {currentPage === 1 ? null : (
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(currentPage - 1);
                            }}
                        />
                    )}
                </PaginationItem>

                {pagesToShow.map((p, index) => (
                    <PaginationItem key={index}>
                        {typeof p === "number" ? (
                            <PaginationLink
                                href="#"
                                aria-current={p === currentPage ? "page" : undefined}
                                className={p === currentPage ? "bg-primary text-white font-semibold" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(p);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    {currentPage === totalPages ? null : (
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(currentPage + 1);
                            }}
                        />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationControls;
