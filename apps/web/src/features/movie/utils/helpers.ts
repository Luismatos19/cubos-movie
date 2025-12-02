export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }
  return date.toLocaleDateString("pt-BR");
}

export function formatDuration(totalMinutes: number) {
  if (!totalMinutes) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function formatCurrency(value: number) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function normalizeTrailerUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.includes("embed")) return url;
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
}
