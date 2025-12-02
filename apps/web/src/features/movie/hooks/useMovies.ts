import { create } from "zustand";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { PaginatedMovies, Movie } from "../types/types";

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

export function useCreateMovie(movieId?: string) {
  return useQuery<Movie, Error>({
    queryKey: ["movie", movieId],
    enabled: Boolean(movieId),
    queryFn: async () => {
      const response = await api.get<Movie>(`/movies/${movieId}`);
      return response.data;
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (movieId: number) => {
      await api.delete(`/movies/${movieId}`);
    },
    onSuccess: () => {
      toast.success("Filme removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Erro ao deletar filme:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao remover filme.";
      toast.error(errorMessage);
    },
  });
}
