import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/Login";
import { RegisterPage } from "./features/auth/pages/Register";
import { MoviesPage } from "./features/movie/pages/Movies";
import { MovieDetailsPage } from "./features/movie/pages/MovieDetails";
import { useThemeStore } from "./stores/useThemeStore";
import { Layout } from "./layout";
import { PublicRoute } from "./routes/PublicRoutes";
import { PrivateRoute } from "./routes/PrivateRoute";

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
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MoviesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/filmes/:movieId"
            element={
              <PrivateRoute>
                <MovieDetailsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
