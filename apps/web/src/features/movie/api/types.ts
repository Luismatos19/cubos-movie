export type Movie = {
  id: number;
  title: string;
  description?: string | null;
  releaseDate: string;
  imageUrl: string;
  classification: number;
  rating: number;
  trailerUrl?: string | null;
  duration: number;
  revenue: number;
  genres: string[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedMovies = {
  items: Movie[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
