import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useThemeStore } from "../../stores/useThemeStore";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { isDark, toggleTheme } = useThemeStore();
  const { logout, isAuthenticated } = useAuth();

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-border bg-background/50 text-foreground px-4 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-4">
        <svg
          width="36"
          height="36"
          viewBox="0 0 160 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-auto"
        >
          <rect
            x="0"
            y="0"
            width="36"
            height="36"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
          />
          <path
            d="M140.8 27.91L159.84 27.91L159.84 9.35L140.8 9.35L140.8 27.91Z"
            fill="currentColor"
            className="text-foreground"
          />
          <path
            d="M117.85 27.91L136.89 27.91L136.89 9.35L117.85 9.35L117.85 27.91Z"
            fill="currentColor"
            className="text-foreground"
          />
          <path
            d="M94.9 27.91L113.94 27.91L113.94 9.35L94.9 9.35L94.9 27.91Z"
            fill="currentColor"
            className="text-foreground"
          />
          <path
            d="M71.95 27.91L90.99 27.91L90.99 9.35L71.95 9.35L71.95 27.91Z"
            fill="currentColor"
            className="text-foreground"
          />
          <path
            d="M49 27.91L68.04 27.91L68.04 9.35L49 9.35L49 27.91Z"
            fill="currentColor"
            className="text-foreground"
          />
          <path
            d="M0 34.66C0 33.95 0.14 33.27 0.42 32.63C0.7 31.99 1.09 31.42 1.59 30.93C2.08 30.43 2.66 30.04 3.3 29.76C3.94 29.48 4.62 29.34 5.33 29.34L30.33 29.34C31.04 29.34 31.72 29.48 32.36 29.76C33 30.04 33.58 30.43 34.07 30.93C34.57 31.42 34.96 31.99 35.24 32.63C35.52 33.27 35.66 33.95 35.66 34.66L35.66 35.91L0 35.91L0 34.66Z"
            fill="currentColor"
            className="text-foreground"
          />
        </svg>
        <span className="font-['Inter'] text-[20px] font-bold tracking-tight text-foreground">
          Movies
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-11 w-11 rounded-sm bg-primary/10 text-foreground hover:bg-primary/15"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>
        {isAuthenticated && (
          <Button
            type="button"
            onClick={logout}
            className="h-11 rounded-sm bg-primary px-5 font-['Roboto'] text-base font-normal text-primary-foreground hover:bg-primary/90"
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
