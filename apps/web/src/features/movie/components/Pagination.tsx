import { memo, useMemo } from "react";
import type { MouseEvent } from "react";

import {
  Pagination as PaginationShadcn,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export const Pagination = memo(function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  const handlePageChange =
    (nextPage: number) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onPageChange(nextPage);
    };

  return (
    <div className="flex flex-col items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <PaginationShadcn>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={
                page === 1 ? "pointer-events-none opacity-40" : undefined
              }
              onClick={handlePageChange(page - 1)}
            />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={handlePageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              className={
                page === totalPages
                  ? "pointer-events-none opacity-40"
                  : undefined
              }
              onClick={handlePageChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationShadcn>
    </div>
  );
});
