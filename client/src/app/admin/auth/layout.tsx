import { Toaster } from "sonner";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 h-screen w-screen flex justify-center items-center">
      {children}
      <Toaster />
    </div>
  );
}

export default AuthLayout;
