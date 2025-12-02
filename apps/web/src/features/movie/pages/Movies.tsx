import { memo, useCallback, useMemo, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "../components/MovieCard";
import { Pagination } from "../components/Pagination";
import { useMoviesFilters, useFetchMovies } from "../hooks/useMovies";
import { MoviesFiltersModal } from "../components/MoviesFiltersModal";
import { AddMovieDrawer } from "../components/AddMovieDrawer";

const PAGE_SIZE = 10;
import backgroundImage from "@/assets/background-image.png";

export function MoviesPage() {
  const search = useMoviesFilters((state) => state.search);
  const page = useMoviesFilters((state) => state.page);
  const setSearch = useMoviesFilters((state) => state.setSearch);
  const setPage = useMoviesFilters((state) => state.setPage);
  const filters = useMoviesFilters(
    useShallow((state) => ({
      minDuration: state.minDuration,
      maxDuration: state.maxDuration,
      startDate: state.startDate,
      endDate: state.endDate,
      genre: state.genre,
      maxClassification: state.maxClassification,
    }))
  );

  const [debouncedSearch] = useDebounce(search, 400);
  const { data, isLoading, error } = useFetchMovies(
    page,
    debouncedSearch,
    filters
  );

  const movies = useMemo(() => data?.items ?? [], [data]);
  const totalItems = data?.pagination.total ?? 0;

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearch("");
  }, [setSearch]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
    },
    [setPage]
  );

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="relative isolate">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[564px] w-screen -translate-x-1/2 
             bg-repeat-round-x bg-top "
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "auto",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4 justify-end ">
              <div className="relative flex-1 min-w-[260px] text-foreground">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Pesquise por filmes"
                  className="h-12 border-border bg-muted pl-12 max-w-122 text-foreground placeholder:text-muted-foreground focus:border-ring"
                />
              </div>
              <div className="flex w-full gap-3 sm:w-auto">
                <MoviesFiltersModal />
                <AddMovieDrawer />
              </div>
            </div>
            <div className="rounded-[8px] border border-border bg-card/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-8">
              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error.message}
                </div>
              )}
              {isLoading ? (
                <MoviesSkeleton />
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}

                    {!movies.length && (
                      <div className="col-span-full flex flex-col items-center gap-3 rounded-[8px] border border-border bg-muted/10 px-6 py-16 text-center text-sm text-muted-foreground">
                        <p>Nenhum filme encontrado com esse termo.</p>
                        <Button
                          variant="outline"
                          className="rounded-full border-border text-foreground hover:bg-muted/20"
                          onClick={handleClearSearch}
                        >
                          Limpar busca
                        </Button>
                      </div>
                    )}
                  </div>
                  {!!movies.length && (
                    <Pagination
                      page={page}
                      pageSize={PAGE_SIZE}
                      totalItems={totalItems}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const MoviesSkeleton = memo(function MoviesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <div
          key={index}
          className="h-[360px] animate-pulse rounded-[8px] border border-border bg-muted/20"
        />
      ))}
    </div>
  );
});
