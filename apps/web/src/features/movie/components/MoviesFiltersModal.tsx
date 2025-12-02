import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMoviesFilters } from "../hooks/useMovies";

const GENRES = [
  "Ação",
  "Aventura",
  "Animação",
  "Comédia",
  "Crime",
  "Documentário",
  "Drama",
  "Família",
  "Fantasia",
  "Ficção Científica",
  "Guerra",
  "Mistério",
  "Romance",
  "Suspense",
  "Terror",
];

export function MoviesFiltersModal() {
  const [open, setOpen] = useState(false);
  
  // Local state for form fields to avoid triggering refetch on every keystroke
  const filters = useMoviesFilters();
  const setFilters = useMoviesFilters((state) => state.setFilters);
  
  const [localFilters, setLocalFilters] = useState({
    minDuration: filters.minDuration,
    maxDuration: filters.maxDuration,
    startDate: filters.startDate,
    endDate: filters.endDate,
    genre: filters.genre,
    maxClassification: filters.maxClassification,
  });

  // Sync local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters({
        minDuration: filters.minDuration,
        maxDuration: filters.maxDuration,
        startDate: filters.startDate,
        endDate: filters.endDate,
        genre: filters.genre,
        maxClassification: filters.maxClassification,
      });
    }
  }, [open, filters]);

  const handleApply = () => {
    setFilters(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({
      minDuration: undefined,
      maxDuration: undefined,
      startDate: undefined,
      endDate: undefined,
      genre: undefined,
      maxClassification: undefined,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border-border bg-background px-5 py-2 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary sm:flex-none"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">
              Filtros
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Refine sua busca por filmes.
            </Dialog.Description>
          </div>

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            {/* Duração */}
            <div className="grid gap-2">
              <Label>Duração (minutos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minDuration || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      minDuration: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxDuration || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxDuration: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Data de Lançamento */}
            <div className="grid gap-2">
              <Label>Data de Lançamento</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={localFilters.startDate || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
                <span className="text-muted-foreground">até</span>
                <Input
                  type="date"
                  value={localFilters.endDate || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Classificação */}
            <div className="grid gap-2">
              <Label>Classificação Indicativa (até x anos)</Label>
              <Input
                type="number"
                placeholder="Ex: 16"
                value={localFilters.maxClassification || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    maxClassification: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>

            {/* Gênero */}
            <div className="grid gap-2">
              <Label>Gênero</Label>
              <RadioGroup.Root
                value={localFilters.genre}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, genre: value }))
                }
                className="grid grid-cols-2 gap-2"
              >
                {GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <RadioGroup.Item
                      value={genre}
                      id={genre}
                      className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-current" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <Label htmlFor={genre} className="font-normal cursor-pointer">
                      {genre}
                    </Label>
                  </div>
                ))}
              </RadioGroup.Root>
              {localFilters.genre && (
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setLocalFilters(prev => ({ ...prev, genre: undefined }))}
                   className="w-fit h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                 >
                   Limpar seleção de gênero
                 </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClear}>
              Limpar Filtros
            </Button>
            <Button onClick={handleApply}>Aplicar Filtros</Button>
          </div>

          <Dialog.Close asChild>
            <Button
              variant="ghost"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

