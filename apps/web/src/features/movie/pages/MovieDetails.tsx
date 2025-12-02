import { memo, useMemo, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RatingBadge } from "../components/RatingBadge";
import { useCreateMovie, useDeleteMovie } from "../hooks/useMovies";
import {
  formatDate,
  formatDuration,
  formatCurrency,
  normalizeTrailerUrl,
} from "../utils/helpers";
import { StatChip } from "../components/StatChip";

const DeleteMovieDialog = lazy(() =>
  import("../components/DeleteMovieDialog").then((module) => ({
    default: module.DeleteMovieDialog,
  }))
);

export function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useCreateMovie(movieId);
  const { mutateAsync: deleteMovie, isPending: isDeleting } = useDeleteMovie();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!movieId) return;

    await deleteMovie(Number(movieId));
  };

  const releaseDate = data?.releaseDate;
  const duration = data?.duration ?? 0;
  const classification = data?.classification ?? 0;
  const revenue = data?.revenue ?? 0;
  const budget = data?.budget ?? 0;
  const language = data?.language || "—";
  const trailer = data?.trailerUrl ?? null;
  const rating = data?.rating ?? 0;
  const description = data?.description ?? "";
  const imageUrl = data?.imageUrl ?? "";

  const releaseLabel = useMemo(
    () => (releaseDate ? formatDate(releaseDate) : "Data indisponível"),
    [releaseDate]
  );
  const durationLabel = useMemo(() => formatDuration(duration), [duration]);
  const classificationLabel = useMemo(
    () => (classification > 0 ? `${classification} ANOS` : "LIVRE"),
    [classification]
  );
  const revenueLabel = useMemo(
    () => (revenue ? formatCurrency(revenue) : "—"),
    [revenue]
  );
  const budgetLabel = useMemo(
    () => (budget ? formatCurrency(budget) : "—"),
    [budget]
  );
  const profit = revenue - budget;
  const profitLabel = useMemo(
    () => (revenue && budget ? formatCurrency(profit) : "—"),
    [profit, revenue, budget]
  );
  const statusLabel = useMemo(() => {
    if (!releaseDate) return "Desconhecido";
    const release = new Date(releaseDate);
    const now = new Date();
    return release > now ? "Em breve" : "Lançado";
  }, [releaseDate]);

  const trailerUrl = useMemo(() => normalizeTrailerUrl(trailer), [trailer]);
  const ratingValue = useMemo(
    () => Math.max(0, Math.min(100, Math.round(rating))),
    [rating]
  );

  const synopsis = useMemo(
    () =>
      description ||
      "Nenhuma sinopse foi cadastrada para este filme até o momento.",
    [description]
  );

  const posterImage = imageUrl;

  if (!movieId) {
    return (
      <StateMessage
        title="Filme não encontrado"
        description="Selecione um filme válido para visualizar os detalhes."
      />
    );
  }

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !data) {
    return (
      <StateMessage
        title="Não foi possível carregar o filme"
        description={error?.message ?? "Tente novamente em instantes."}
      />
    );
  }

  return (
    <article className="min-h-screen bg-background text-foreground">
      <header className="relative h-[500px] w-full overflow-hidden lg:h-[600px]">
        <div className="absolute inset-0">
          <img
            src={posterImage}
            alt={`Poster de ${data.title}`}
            className="h-full w-full object-cover opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </header>

      <div className="relative mx-auto -mt-[380px] flex w-full max-w-[1380px] flex-col px-4 pb-20 sm:px-8 lg:-mt-[480px] lg:px-12">
        <header className="mb-8 hidden items-center justify-between lg:flex">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{data.title}</h1>
            <p className="text-lg text-muted-foreground">
              Título original: {data.title}
            </p>
          </div>
          <nav className="flex gap-4" aria-label="Ações do filme">
            <Button
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Editar
            </Button>
            <Button
              onClick={handleDeleteClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Deletar
            </Button>
          </nav>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0">
            <figure className="relative mx-auto aspect-2/3 w-full max-w-[300px] overflow-hidden rounded-[4px] shadow-[0px_4px_20px_rgba(0,0,0,0.5)] lg:w-[374px]">
              <img
                src={posterImage}
                alt={`Poster de ${data.title}`}
                className="h-full w-full object-cover"
              />
            </figure>
            <div className="mt-6 flex flex-col gap-6 lg:hidden">
              <nav className="flex gap-4" aria-label="Ações do filme">
                <Button
                  variant="secondary"
                  onClick={handleDeleteClick}
                  className="w-[35%] bg-secondary text-secondary-foreground hover:bg-secondary/80 "
                >
                  Deletar
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Editar
                </Button>
              </nav>

              <header className="text-center">
                <h1 className="text-3xl font-bold text-foreground">
                  {data.title}
                </h1>
                <p className="text-base text-muted-foreground">
                  Título original: {data.title}
                </p>
              </header>
            </div>
          </aside>

          <div className="flex flex-1 flex-col gap-6">
            <section className="flex flex-wrap items-start justify-between gap-4">
              <p className="text-lg italic text-foreground/90 opacity-90">
                {description
                  ? "Aventure-se nesta história."
                  : "Todo herói tem um começo."}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center rounded-[4px] bg-card/75 p-4 backdrop-blur-sm border border-border/10">
                  <span className="text-xs font-bold uppercase text-muted-foreground">
                    Classificação Indicativa
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {classificationLabel}
                  </span>
                </div>
                <RatingBadge value={ratingValue} />
              </div>
            </section>

            <div className="flex flex-col gap-4 lg:flex-row">
              <section className="flex flex-1 flex-col gap-4">
                <section className="rounded-[4px] bg-card/60 p-4 backdrop-blur-sm border border-border/10">
                  <h2 className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                    Sinopse
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground">
                    {synopsis}
                  </p>
                </section>

                <section className="rounded-[4px] bg-card/60 p-4 border border-border/10">
                  <h2 className="mb-3 text-sm font-bold text-muted-foreground">
                    Gêneros
                  </h2>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {data.genres.length ? (
                      data.genres.map((genre) => (
                        <li key={genre} role="listitem">
                          <span className="rounded-[4px] bg-primary/18 w-[138px] h-[32px] flex items-center justify-center  text-xs font-semibold uppercase text-foreground backdrop-blur-sm">
                            {genre}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="text-sm text-muted-foreground">
                          Nenhum gênero cadastrado.
                        </span>
                      </li>
                    )}
                  </ul>
                </section>
              </section>

              <aside className="flex w-full flex-col gap-4 lg:w-[200px]">
                <StatChip label="Lançamento" value={releaseLabel} />
                <StatChip label="Duração" value={durationLabel} />
                <StatChip label="Situação" value={statusLabel} />
                <StatChip label="Idioma" value={language} />
              </aside>
            </div>

            <section
              className="grid grid-cols-2 gap-4 sm:grid-cols-3"
              aria-label="Informações financeiras"
            >
              <StatChip label="Orçamento" value={budgetLabel} size="sm" />
              <StatChip label="Receita" value={revenueLabel} size="sm" />
              <StatChip label="Lucro" value={profitLabel} size="sm" />
            </section>

            <section className="mt-4">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Trailer
              </h2>
              <div className="aspect-video w-full overflow-hidden rounded-[4px] bg-muted/40">
                {trailerUrl ? (
                  <iframe
                    title={`Trailer de ${data.title}`}
                    src={`${trailerUrl}${trailerUrl.includes("?") ? "&" : "?"}rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Trailer indisponível
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <DeleteMovieDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </Suspense>
    </article>
  );
}

const DetailsSkeleton = memo(function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-[1380px] animate-pulse">
        <div className="h-[400px] w-full rounded-lg bg-muted/20" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="h-[450px] rounded-lg bg-muted/20" />
          <div className="space-y-4">
            <div className="h-10 w-1/2 rounded bg-muted/20" />
            <div className="h-40 rounded bg-muted/20" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 rounded bg-muted/20" />
              <div className="h-20 rounded bg-muted/20" />
              <div className="h-20 rounded bg-muted/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StateMessage = memo(function StateMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="flex flex-1 items-center justify-center bg-background px-4 py-20 text-center text-foreground">
      <div className="max-w-lg space-y-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </section>
  );
});
