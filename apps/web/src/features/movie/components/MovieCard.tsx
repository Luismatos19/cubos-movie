import { memo, useCallback, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Movie } from "../types/types";
import { RatingBadge } from "./RatingBadge";
import { Card } from "@/components/ui/card";

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a74b7f8c4ac5?auto=format&fit=crop&w=600&q=60";

export const MovieCard = memo(function MovieCard({
  movie,
  className,
}: MovieCardProps) {
  const navigate = useNavigate();

  const poster = movie.imageUrl || FALLBACK_POSTER;

  const rating = useMemo(
    () =>
      typeof movie.rating === "number" && movie.rating > 0
        ? movie.rating
        : null,
    [movie.rating]
  );

  const genresLabel = useMemo(() => {
    if (!Array.isArray(movie.genres) || !movie.genres.length) return null;
    return movie.genres.filter(Boolean).join(", ");
  }, [movie.genres]);

  const handleNavigate = () => {
    navigate(`/filmes/${movie.id}`);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleNavigate();
      }
    },
    [handleNavigate]
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do filme ${movie.title}`}
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-[5px] border-0 bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-[5px]">
        <img
          src={poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:brightness-50"
          loading="lazy"
        />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {rating !== null && <RatingBadge value={rating} />}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end  p-4 pt-16 transition-all duration-300">
          <h3 className="line-clamp-2 text-lg font-bold text-white transition-all duration-300">
            {movie.title}
          </h3>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              {genresLabel && (
                <p className="mt-2 text-sm font-medium text-gray-300">
                  {genresLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
