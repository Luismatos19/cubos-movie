import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedMovies } from "../types/types";

interface MoviesFilters {
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
  genre?: string;
  maxClassification?: number;
}

interface MoviesFiltersState extends MoviesFilters {
  page: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: MoviesFilters) => void;
  clearFilters: () => void;
}

export const useMoviesFilters = create<MoviesFiltersState>((set) => ({
  page: 1,
  search: "",
  minDuration: undefined,
  maxDuration: undefined,
  startDate: undefined,
  endDate: undefined,
  genre: undefined,
  maxClassification: undefined,
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),
  setFilters: (filters) => set({ ...filters, page: 1 }),
  clearFilters: () =>
    set({
      minDuration: undefined,
      maxDuration: undefined,
      startDate: undefined,
      endDate: undefined,
      genre: undefined,
      maxClassification: undefined,
      page: 1,
    }),
}));

export function useFetchMovies(
  page: number,
  search: string,
  filters?: MoviesFilters
) {
  return useQuery<PaginatedMovies>({
    queryKey: ["movies", page, search, filters],
    queryFn: async () => {
      const response = await api.get<PaginatedMovies>("/movies", {
        params: {
          page,
          search,
          limit: 10,
          ...filters,
        },
      });
      return response.data;
    },
    placeholderData: (previous) => previous,
  });
}
