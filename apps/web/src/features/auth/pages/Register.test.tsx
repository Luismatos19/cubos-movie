import { render, screen } from '@testing-library/react';
import { RegisterPage } from './Register';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';

const queryClient = new QueryClient();

describe('RegisterPage', () => {
  it('should render register form', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirme a senha')).toBeInTheDocument();
  });
});

