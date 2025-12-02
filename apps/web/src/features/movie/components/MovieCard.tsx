import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Movie } from "../api/types";

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a74b7f8c4ac5?auto=format&fit=crop&w=600&q=60";

export function MovieCard({ movie, className }: MovieCardProps) {
  const navigate = useNavigate();
  const poster = movie.imageUrl || FALLBACK_POSTER;
  const releaseDate = new Date(movie.releaseDate);
  const dateLabel = releaseDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const rating =
    typeof movie.rating === "number" && movie.rating > 0 ? movie.rating : null;
  const genresLabel =
    Array.isArray(movie.genres) && movie.genres.length
      ? movie.genres.filter(Boolean).join(" • ")
      : null;

  const handleNavigate = (): void => {
    navigate(`/filmes/${movie.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do filme ${movie.title}`}
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-[5px] border border-border bg-card/80 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <div className="relative h-[355px] w-full  overflow-hidden">
        <img
          src={poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 px-4 pb-5 pt-16">
          <h3 className="text-lg font-semibold text-foreground">
            {movie.title}
          </h3>
        </div>
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between bg-background/80 px-4 py-5 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex justify-end">
            {rating !== null && <RatingBadge value={rating} />}
          </div>
          <div className="space-y-3 text-left">
            <h4 className="text-lg font-semibold text-foreground">
              {movie.title}
            </h4>
            {genresLabel && (
              <p className="text-sm text-muted-foreground">{genresLabel}</p>
            )}
          </div>
        </div>
      </div>
      <CardContent className="hidden" />
    </Card>
  );
}

function RatingBadge({ value }: { value: number }): JSX.Element {
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  const angle = Math.round((clampedValue / 100) * 360);

  return (
    <div
      className="flex items-center justify-center rounded-full border-4 border-muted/60 bg-background/40 p-2 transition-transform duration-300 group-hover:scale-110"
      style={{
        background: `conic-gradient(var(--color-primary) ${angle}deg, rgba(255,255,255,0.12) ${angle}deg 360deg)`,
        width: 96,
        height: 96,
      }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full bg-background/80 text-center"
        style={{ width: 68, height: 68 }}
      >
        <span className="text-xl font-semibold text-primary">
          {clampedValue}
        </span>
        <span className="text-xs font-semibold text-foreground">%</span>
      </div>
    </div>
  );
}
