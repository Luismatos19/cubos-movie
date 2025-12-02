import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./stores/useThemeStore";
import { Layout } from "./layout";
import { PublicRoute } from "./routes/PublicRoutes";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Toaster } from "./components/ui/sonner";

const LoginPage = lazy(() =>
  import("./features/auth/pages/Login").then((module) => ({
    default: module.LoginPage,
  }))
);

const RegisterPage = lazy(() =>
  import("./features/auth/pages/Register").then((module) => ({
    default: module.RegisterPage,
  }))
);

const MoviesPage = lazy(() =>
  import("./features/movie/pages/Movies").then((module) => ({
    default: module.MoviesPage,
  }))
);

const MovieDetailsPage = lazy(() =>
  import("./features/movie/pages/MovieDetails").then((module) => ({
    default: module.MovieDetailsPage,
  }))
);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <LoginPage />
                </Suspense>
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <RegisterPage />
                </Suspense>
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <MoviesPage />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/filmes/:movieId"
            element={
              <PrivateRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <MovieDetailsPage />
                </Suspense>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

function PageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default App;
