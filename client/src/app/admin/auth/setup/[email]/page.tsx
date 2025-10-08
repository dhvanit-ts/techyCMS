"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { useParams, useRouter } from "next/navigation";
import fetcher from "@/utils/fetcher";

function UserSetupPage() {
  const { email } = useParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        if (!email) return;

        await fetcher.post({
          endpointPath: `/admin/register`,
          data: { email },
          statusShouldBe: 201,
          fallbackErrorMessage: "Error creating the user",
          throwIfError: true,
        });

        router.push("/");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while creating the user");
      }
    })();
  }, [email, router]);

  return (
    <div className="text-zinc-100 flex flex-col justify-center items-center space-y-4">
      <h3>Setting up the user, this may take a moment.</h3>
      <LuLoaderCircle className="animate-spin text-2xl" />
    </div>
  );
}

export default UserSetupPage;
