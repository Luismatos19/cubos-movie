import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "../components/MovieCard";
import { PaginationControls } from "../components/PaginationControls";
import { useMoviesFilters, useFetchMovies } from "../hooks/useMovies";

const PAGE_SIZE = 10;
import backgroundImage from "@/assets/background-image.png";

export function MoviesPage() {
  const { search, setSearch, page, setPage } = useMoviesFilters();
  const [debouncedSearch] = useDebounce(search, 400);
  const { data, isLoading, error } = useFetchMovies(page, debouncedSearch);
  const movies = data?.items ?? [];
  console.log(movies);

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquise por filmes"
                  className="h-12 border-border bg-muted/40 pl-12 text-foreground placeholder:text-muted-foreground focus:border-ring"
                />
              </div>
              <div className="flex w-full gap-3 sm:w-auto">
                <Button
                  variant="outline"
                  className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border-border bg-background px-5 py-2 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary sm:flex-none"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
                <Button
                  className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:flex-none"
                  onClick={() => {}}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar filme
                </Button>
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
                          onClick={() => setSearch("")}
                        >
                          Limpar busca
                        </Button>
                      </div>
                    )}
                  </div>
                  {data && (
                    <PaginationControls
                      page={page}
                      pageSize={PAGE_SIZE}
                      totalItems={data.pagination.total}
                      onChange={setPage}
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

function MoviesSkeleton() {
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
}
