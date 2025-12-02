import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number) => void;
};

export function PaginationControls({
  page,
  pageSize,
  totalItems,
  onChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onChange(nextPage);
  };

  const handleClick =
    (nextPage: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      changePage(nextPage);
    };

  return (
    <div className="flex flex-col items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={
                page === 1 ? "pointer-events-none opacity-40" : undefined
              }
              onClick={handleClick(page - 1)}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={handleClick(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              className={
                page === totalPages
                  ? "pointer-events-none opacity-40"
                  : undefined
              }
              onClick={handleClick(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
