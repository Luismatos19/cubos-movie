import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  rating: z.coerce
    .number()
    .min(0, "A nota deve ser no mínimo 0")
    .max(100, "A nota deve ser no máximo 100"),
  trailerUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  duration: z.coerce.number().min(1, "A duração deve ser maior que 0"),
  budget: z.coerce.number().min(0).optional(),
  language: z.string().optional(),
  image: z
    .any()
    .refine((files) => files?.length == 1, "A imagem é obrigatória.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `O tamanho máximo é 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Formato de imagem inválido."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function AddMovieDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      rating: 0,
      duration: 0,
      budget: 0,
      language: "Português",
    },
  });

  const { mutateAsync: createMovie } = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("releaseDate", new Date(data.releaseDate).toISOString());
      formData.append("rating", data.rating.toString());
      formData.append("duration", data.duration.toString());

      if (data.trailerUrl) formData.append("trailerUrl", data.trailerUrl);
      if (data.budget) formData.append("budget", data.budget.toString());
      if (data.language) formData.append("language", data.language);

      if (data.image?.[0]) {
        formData.append("file", data.image[0]);
      }

      await api.post("/movies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setIsOpen(false);
      reset();
      toast.success("Filme adicionado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Failed to create movie:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao adicionar filme.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createMovie(data);
    } catch (error) {
      // Error handled in onError
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:flex-none">
          <Plus className="h-4 w-4" />
          Adicionar filme
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar Filme</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para adicionar um novo filme ao catálogo.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 py-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Nome do filme"
            />
            {errors.title && (
              <span className="text-xs text-destructive">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
              placeholder="Sinopse do filme"
            />
            {errors.description && (
              <span className="text-xs text-destructive">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="releaseDate">
                Data de Lançamento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="releaseDate"
                type="date"
                {...register("releaseDate")}
              />
              {errors.releaseDate && (
                <span className="text-xs text-destructive">
                  {errors.releaseDate.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duração (min) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                {...register("duration")}
                placeholder="120"
              />
              {errors.duration && (
                <span className="text-xs text-destructive">
                  {errors.duration.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">
                Nota (0-100) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rating"
                type="number"
                {...register("rating")}
                placeholder="85"
              />
              {errors.rating && (
                <span className="text-xs text-destructive">
                  {errors.rating.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento</Label>
              <Input
                id="budget"
                type="number"
                {...register("budget")}
                placeholder="1000000"
              />
              {errors.budget && (
                <span className="text-xs text-destructive">
                  {errors.budget.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma Original</Label>
            <Input
              id="language"
              {...register("language")}
              placeholder="Inglês"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailerUrl">URL do Trailer</Label>
            <Input
              id="trailerUrl"
              {...register("trailerUrl")}
              placeholder="https://youtube.com/..."
            />
            {errors.trailerUrl && (
              <span className="text-xs text-destructive">
                {errors.trailerUrl.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Imagem de Capa <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                {...register("image")}
              />
            </div>
            {errors.image && (
              <span className="text-xs text-destructive">
                {errors.image.message?.toString()}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Adicionar Filme
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
