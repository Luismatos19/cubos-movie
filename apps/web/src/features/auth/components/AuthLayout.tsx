import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

import backgroundImage from "@/assets/background-image.png";

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex flex-1 items-center justify-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[564px] w-[1440px] -translate-x-1/2">
        <img
          src={backgroundImage}
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-46"
        />
      </div>

      <section className="relative w-full px-4 py-10">
        <div className="mx-auto w-full max-w-[380px] rounded-[4px] bg-card p-4 shadow-2xl">
          {children}
        </div>
      </section>
    </main>
  );
}
