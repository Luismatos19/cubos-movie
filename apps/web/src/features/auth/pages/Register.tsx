import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRegister } from "../hooks/useRegister";
import { useRedirectIfAuthenticated } from "../hooks/useRedirectIfAuthenticated";

const registerSchema = z
  .object({
    name: z.string().min(3, "Informe ao menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const HERO_IMAGE_URL = "/Background-image.png";

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError } = useRegister();
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    await mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    alert("Cadastro realizado com sucesso!");
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[564px] w-[1440px] -translate-x-1/2">
        <img
          src={HERO_IMAGE_URL}
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-46"
        />
      </div>

      <div className="relative w-full px-4 py-10">
        <div className="mx-auto w-full max-w-[380px] rounded-[4px] bg-card p-4 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="font-['Roboto'] text-[12.8px] font-bold uppercase tracking-wide text-foreground"
              >
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                {...register("name")}
                className="h-11 rounded-[4px] border bg-input p-3 mt-2 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-['Roboto'] text-[12.8px] font-bold uppercase tracking-wide text-foreground"
              >
                E-mail
              </Label>
              <Input
                id="email"
                placeholder="Digite seu e-mail"
                {...register("email")}
                className="h-11 rounded-[4px] border bg-input p-3 mt-2 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="h-11 rounded-[4px] border bg-input p-3 mt-2 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-['Roboto'] text-[12.8px] font-bold uppercase tracking-wide text-foreground"
              >
                Confirme a senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                {...register("confirmPassword")}
                className="h-11 rounded-[4px] border bg-input p-3 mt-2 font-['Roboto'] text-base text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {isError && (
              <p className="text-sm text-destructive">
                Não foi possível completar o cadastro. Tente novamente.
              </p>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="h-11 w-full rounded-sm bg-primary px-5 font-['Roboto'] text-base font-normal text-primary-foreground hover:bg-primary/90 py-3"
                disabled={isPending}
              >
                {isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Já possui conta?{" "}
                <a
                  href="/login"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Faça login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
