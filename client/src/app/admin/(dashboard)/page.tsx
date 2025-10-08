import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans max-w-screen overflow-x-hidden bg-zinc-300 text-zinc-900 min-h-screen">
      <div className="h-12 flex items-center justify-center w-full bg-orange-600 text-zinc-300">
        <div className="flex justify-between items-center w-full max-w-7xl px-3">
          <Link href="/" className="text-xl font-semibold text-zinc-200 hover:cursor-pointer hover:text-zinc-100">TechyCMS</Link>
          <div>
            <Button variant="secondary" asChild>
              <Link href="/admin/auth/signin">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
