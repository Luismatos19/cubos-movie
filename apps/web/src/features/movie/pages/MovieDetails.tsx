import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Movie } from "../api/types";

type Stat = {
  label: string;
  value: string;
};

const detailBackground =
  "https://www.figma.com/api/mcp/asset/d7d690cf-6933-41b6-8601-7e4a41f3e216";

export function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const { data, isLoading, error } = useQuery<Movie, Error>({
    queryKey: ["movie", movieId],
    enabled: Boolean(movieId),
    queryFn: async () => {
      const response = await api.get<Movie>(`/movies/${movieId}`);
      return response.data;
    },
  });

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

  const releaseLabel = formatDate(data.releaseDate);
  const durationLabel = formatDuration(data.duration);
  const classificationLabel =
    data.classification > 0 ? `${data.classification} anos` : "Livre";
  const revenueLabel = formatCurrency(data.revenue);
  const trailerUrl = normalizeTrailerUrl(data.trailerUrl);
  const ratingValue = Math.max(0, Math.min(100, Math.round(data.rating)));

  const synopsis =
    data.description ||
    "Nenhuma sinopse foi cadastrada para este filme até o momento.";

  const infoPrimary: Stat[] = [
    { label: "Lançamento", value: releaseLabel },
    { label: "Duração", value: durationLabel },
    { label: "Classificação", value: classificationLabel },
  ];

  const infoSecondary: Stat[] = [{ label: "Receita", value: revenueLabel }];

  const heroImage = data.imageUrl || detailBackground;
  const posterImage = data.imageUrl || detailBackground;

  return (
    <section className="flex-1 bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/75 to-background" />
        <div className="relative mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-8 lg:px-12">
          <div className="rounded-[8px] border border-border bg-card/90 shadow-[0_20px_70px_rgba(0,0,0,0.65)]">
            <div className="relative overflow-hidden rounded-t-[8px]">
              <img
                src={heroImage}
                alt={data.title}
                className="h-[360px] w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </div>
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold">{data.title}</h1>
                  <p className="text-base text-muted-foreground">
                    {`Lançado em ${releaseLabel}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-[2px] border border-primary/70 px-6 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
                    Deletar
                  </button>
                  <button className="rounded-[2px] bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                    Editar
                  </button>
                </div>
              </header>

              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col gap-6 lg:w-[340px]">
                  <div className="overflow-hidden rounded-[6px] border border-border bg-muted/40 shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
                    <img
                      src={posterImage}
                      alt={`Poster do filme ${data.title}`}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm italic text-foreground">
                    {classificationLabel}
                  </p>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <InfoBlock
                      title="Classificação"
                      value={classificationLabel}
                    />
                    <InfoBlock
                      title="Duração"
                      value={
                        durationLabel === "0m" ? "Indisponível" : durationLabel
                      }
                    />
                    <RatingCircle value={ratingValue} size={110} />
                  </div>

                  <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                      Sinopse
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {synopsis}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                      Gêneros
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {data.genres.length ? (
                        data.genres.map((genre) => (
                          <span
                            key={genre}
                            className="rounded-[2px] bg-primary/15 px-3 py-1 text-xs font-semibold uppercase text-primary"
                          >
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Nenhum gênero cadastrado.
                        </span>
                      )}
                    </div>
                  </section>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {infoPrimary.map((stat) => (
                      <StatCard key={stat.label} stat={stat} />
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {infoSecondary.map((stat) => (
                      <StatCard key={stat.label} stat={stat} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-[8px] border border-border bg-card/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.65)] sm:p-10">
            <h2 className="text-2xl font-semibold">Trailer</h2>
            <div className="mt-4 aspect-video overflow-hidden rounded-[8px] border border-border bg-muted/30">
              {trailerUrl ? (
                <iframe
                  title={`Trailer de ${data.title}`}
                  src={`${trailerUrl}${trailerUrl.includes("?") ? "&" : "?"}rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Trailer indisponível para este filme.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[4px] border border-border bg-muted/30 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-[4px] border border-border bg-muted/30 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        {stat.label}
      </p>
      <p className="text-sm font-semibold text-foreground">{stat.value}</p>
    </div>
  );
}

function RatingCircle({ value, size = 120 }: { value: number; size?: number }) {
  const angle = Math.min(360, Math.max(0, Math.round((value / 100) * 360)));
  const innerSize = size - 20;
  return (
    <div
      className="flex items-center justify-center rounded-full border-4 border-muted/60"
      style={{
        background: `conic-gradient(var(--color-primary) ${angle}deg, rgba(255,255,255,0.12) ${angle}deg 360deg)`,
        width: size,
        height: size,
      }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full bg-background/80 text-center"
        style={{ width: innerSize, height: innerSize }}
      >
        <span className="text-2xl font-semibold text-primary">{value}</span>
        <span className="text-sm font-semibold text-foreground">%</span>
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <section className="flex-1 bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-8 lg:px-12">
          <div className="animate-pulse rounded-[8px] border border-border bg-card/90 p-8">
            <div className="h-6 w-1/3 rounded bg-muted/30" />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="h-[320px] rounded bg-muted/20" />
              <div className="space-y-4">
                <div className="h-5 w-2/3 rounded bg-muted/30" />
                <div className="h-4 w-full rounded bg-muted/20" />
                <div className="h-4 w-5/6 rounded bg-muted/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StateMessage({
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
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(totalMinutes: number) {
  if (!totalMinutes) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function formatCurrency(value: number) {
  if (!value) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeTrailerUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.includes("embed")) return url;
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
}
