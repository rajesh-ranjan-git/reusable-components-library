import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { staticImages } from "@/config/common.config";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="relative flex justify-center items-center bg-bg p-4 min-h-screen overflow-hidden">
      <div className="hidden sm:block top-1/4 -left-64 absolute bg-primary/20 blur-[100px] rounded-full w-125 h-125 pointer-events-none mix-blend-screen"></div>
      <div className="hidden sm:block -right-64 bottom-1/4 absolute bg-accent/20 blur-[120px] rounded-full w-150 h-150 pointer-events-none mix-blend-screen"></div>

      <div className="z-10 relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/discover"
            className="group inline-flex justify-center items-center gap-2 mb-6"
          >
            <div className="flex justify-center items-center bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/20 rounded-full w-10 h-10 group-hover:scale-105 transition-transform">
              <Image
                src={staticImages.mainLogo.src}
                alt={staticImages.mainLogo.alt}
                width={200}
                height={200}
                className="shadow-md rounded-full select-none"
              />
            </div>
            <span className="font-bold text-white text-2xl tracking-tight">
              Your App Name
            </span>
          </Link>
          <h1 className="mb-2 font-bold text-white text-2xl">{title}</h1>
          {subtitle && (
            <p className="text-text-secondary text-sm">{subtitle}</p>
          )}
        </div>

        <div className="bg-surface shadow-2xl sm:backdrop-blur-xl p-6 sm:p-8 border border-white/10 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
