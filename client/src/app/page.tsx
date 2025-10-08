import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans max-w-screen overflow-x-hidden bg-zinc-200 text-zinc-900 min-h-screen">
      <Link href="/admin" className="text-2xl px-3 py-2 rounded-md transition-all bg-zinc-100 hover:bg-orange-600 hover:text-zinc-100 text-zinc-900 block w-fit m-auto">Go to Admin Panel</Link>
    </div>
  );
}
