import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useLogin } from "../hooks/useLogin";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const HERO_IMAGE_URL = "/Background-image.png";

export function LoginPage() {
  const { mutate: login, isPending, isError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema): void => {
    login(data, {
      onSuccess: () => {
        alert("Login realizado com sucesso!");
      },
    });
  };

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[564px] w-[1440px] -translate-x-1/2">
        <img
          src={HERO_IMAGE_URL}
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative w-full px-4 py-10">
        <div className="mx-auto w-full max-w-[380px] rounded-[4px] bg-card p-4 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-['Roboto'] text-[12.8px] font-bold uppercase tracking-wide text-foreground"
              >
                Nome/E-mail
              </Label>
              <Input
                id="email"
                placeholder="Digite seu nome/E-mail"
                {...register("email")}
                className="h-11 rounded-[4px] border bg-input px-3 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-['Roboto'] text-[12.8px] font-bold uppercase tracking-wide text-foreground"
              >
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                {...register("password")}
                className="h-11 rounded-[4px] border bg-input px-3 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isError && (
              <p className="text-sm text-destructive">
                Credenciais inválidas. Verifique seu e-mail e senha.
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="#"
                className="font-['Roboto'] text-base font-normal text-primary underline underline-offset-2 hover:text-primary/90"
              >
                Esqueci minha senha
              </a>
              <Button
                type="submit"
                className="h-11 rounded-sm bg-primary px-5 font-['Roboto'] text-base font-normal text-primary-foreground hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
