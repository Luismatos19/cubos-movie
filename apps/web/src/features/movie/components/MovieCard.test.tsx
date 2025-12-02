import { render, screen } from "@testing-library/react";
import { MovieCard } from "./MovieCard";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

const mockMovie = {
  id: 1,
  title: "Test Movie",
  releaseDate: "2023-01-01",
  imageUrl: "http://img.com/1.jpg",
  classification: 12,
  rating: 80,
  trailerUrl: "",
  duration: 120,
  revenue: 1000,
  genres: ["Action"],
  createdAt: "",
  updatedAt: "",
  // userId: 1, // Assuming frontend type might differ or matches backend
  description: "Desc",
};

describe("MovieCard", () => {
  it("should render movie title", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie as any} />
      </BrowserRouter>
    );
    expect(screen.getAllByText("Test Movie")[0]).toBeInTheDocument();
  });
});
