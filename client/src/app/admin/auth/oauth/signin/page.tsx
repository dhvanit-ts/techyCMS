"use client";

import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";

export default function OAuthRedirect() {
  const router = useRouter();
  const navigate = router.push;

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tempToken = params.get("tempToken");

        if (!tempToken) return;

        await fetcher.post({
          endpointPath: `/admin/finalize`,
          data: { tempToken },
          statusShouldBe: 200,
          fallbackErrorMessage: "Error signing up",
          onError: () => {
            navigate("/login");
            return
          },
          throwIfError: true,
        });

        navigate("/");
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    })();
  }, [navigate]);

  return (
    <div className="text-zinc-100 flex flex-col justify-center items-center space-y-4">
      <h3>Signing you in...</h3>
      <LuLoaderCircle className="animate-spin text-2xl" />
    </div>
  );
}
