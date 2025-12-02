import { memo } from "react";

export const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 text-center font-['Montserrat'] text-base text-muted-foreground">
      2025 © Todos os direitos reservados a{" "}
      <span className="font-semibold text-card-foreground">Cubos Movies</span>
    </footer>
  );
});
