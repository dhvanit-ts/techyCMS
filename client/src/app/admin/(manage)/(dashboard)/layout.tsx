"use client";

import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans max-w-screen overflow-x-auto bg-zinc-200 text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="h-12 flex items-center justify-center w-full bg-orange-600 text-zinc-300">
        <div className="flex justify-between items-center w-full max-w-7xl px-3">
          <Link
            href="/"
            className="text-xl font-semibold text-zinc-200 hover:cursor-pointer hover:text-zinc-100"
          >
            TechyCMS
          </Link>
          <ProfileCard />
        </div>
      </div>
      {children}
    </div>
  );
}
