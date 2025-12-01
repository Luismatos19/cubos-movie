import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useAuthStore } from "../../../stores/useAuthStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const loginUser = async (credentials: LoginCredentials) => {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);
  return data;
};

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: ({ access_token }) => {
      setToken(access_token);
    },
  });
}
