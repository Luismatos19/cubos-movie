import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
    },
  });
};
