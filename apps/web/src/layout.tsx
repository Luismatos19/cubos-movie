import { Header, Footer } from "./components/layout";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
