"use client";

import ProfileCard from "@/components/ProfileCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="font-sans max-w-screen overflow-x-auto bg-zinc-200 text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="h-12 flex items-center justify-center w-full bg-gradient-to-r from-orange-600 to-orange-700 text-zinc-300">
        <div className="flex justify-between items-center w-full max-w-7xl px-3">
          <Link
            href="/admin"
            className="text-xl font-semibold text-zinc-200 hover:cursor-pointer hover:text-zinc-100"
          >
            TechyCMS
          </Link>
          <div className="flex justify-center items-center space-x-4">
            {links.map((link) => {
              const isActive = link.href === pathname;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-zinc-300 text-sm hover:underline underline-offset-4 hover:cursor-pointer hover:text-zinc-100 font-semibold",
                    isActive ? "text-zinc-100" : ""
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <ProfileCard />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

const links = [
  {
    name: "Pages",
    href: "/admin",
  },
  {
    name: "Components",
    href: "/admin/components",
  },
];
