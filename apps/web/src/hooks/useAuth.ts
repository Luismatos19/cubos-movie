import { useAuthStore } from "../stores/useAuthStore";

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  return {
    token,
    isAuthenticated: !!token,
    logout,
  };
}
