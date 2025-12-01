import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },
  });
}
