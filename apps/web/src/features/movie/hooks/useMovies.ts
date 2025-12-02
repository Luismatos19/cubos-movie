import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedMovies } from "../api/types";

interface MoviesFiltersState {
  page: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

export const useMoviesFilters = create<MoviesFiltersState>((set) => ({
  page: 1,
  search: "",
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),
}));

export function useFetchMovies(page: number, search: string) {
  return useQuery<PaginatedMovies>({
    queryKey: ["movies", page, search],
    queryFn: async () => {
      const response = await api.get<PaginatedMovies>("/movies", {
        params: { page, search, limit: 10 },
      });
      return response.data;
    },
    placeholderData: (previous) => previous,
  });
}
