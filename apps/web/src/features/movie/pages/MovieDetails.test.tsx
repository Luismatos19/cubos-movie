import { render, screen, waitFor } from '@testing-library/react';
import { MovieDetailsPage } from './MovieDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import { server } from '../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('MovieDetailsPage', () => {
  it('should render movie details', async () => {
    server.use(
      http.get('*/movies/1', () => {
        return HttpResponse.json({
          id: 1,
          title: 'Detail Movie',
          releaseDate: '2023-01-01',
          imageUrl: '',
          classification: 12,
          rating: 80,
          trailerUrl: '',
          duration: 120,
          revenue: 1000,
          genres: ['Action'],
          createdAt: '',
          updatedAt: '',
          userId: 1,
          description: 'Description',
        });
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/filmes/1']}>
          <Routes>
            <Route path="/filmes/:movieId" element={<MovieDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('Detail Movie')).toBeInTheDocument());
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});

