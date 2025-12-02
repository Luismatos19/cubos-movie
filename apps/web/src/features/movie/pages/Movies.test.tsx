import { render, screen, waitFor } from "@testing-library/react";
import { MoviesPage } from "./Movies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../mocks/server";
import { http, HttpResponse } from "msw";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("MoviesPage", () => {
  it("should render movies list", async () => {
    server.use(
      http.get("*/movies", () => {
        return HttpResponse.json({
          items: [
            {
              id: 1,
              title: "Movie 1",
              releaseDate: "2023-01-01",
              imageUrl: "",
              classification: 12,
              rating: 80,
              trailerUrl: "",
              duration: 120,
              revenue: 1000,
              genres: ["Action"],
              createdAt: "",
              updatedAt: "",
              userId: 1,
              description: "Desc",
            },
          ],
          pagination: { page: 1, total: 1, perPage: 10, totalPages: 1 },
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MoviesPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Movie 1")).toBeInTheDocument()
    );
  });

  it("should render empty state", async () => {
    server.use(
      http.get("*/movies", () => {
        return HttpResponse.json({
          items: [],
          pagination: { page: 1, total: 0, perPage: 10, totalPages: 0 },
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MoviesPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(
        screen.getByText("Nenhum filme encontrado com esse termo.")
      ).toBeInTheDocument()
    );
  });
});
