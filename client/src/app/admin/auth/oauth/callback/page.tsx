"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import InputBox from "@/components/InputBox";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import fetcher from "@/utils/fetcher";

const signInSchema = z.object({
  username: z.string(),
});

type SignInFormData = z.infer<typeof signInSchema>;

function OAuthSetupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = useSearchParams().get("email");
  const router = useRouter();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      if (!email) {
        router.push("/auth/signin");
        return;
      }

      if (!data.username) {
        toast.error("Please select a branch");
        return;
      }

      await fetcher.post({
        endpointPath: `/admin/oauth`,
        data: { email, username: data.username },
        statusShouldBe: 201,
        fallbackErrorMessage: "Error setting up the user",
        throwIfError: true,
      });

      router.push("/");
    } catch (err) {
      toast.error("Error setting up the user");
      console.error("Sign in error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-zinc-800 border rounded-md text-zinc-100 space-y-3 w-96"
    >
      <h1 className="text-3xl mb-6">Sign Up</h1>
      <Controller
        control={control}
        name="username"
        render={() => (
          <InputBox
            error={errors.username?.message}
            label="username"
            placeholder="Enter your username"
            id="username"
            {...register("username")}
          />
        )}
      />
      <button
        type="submit"
        disabled={
          isSubmitting || (errors?.username && errors.username !== undefined)
        }
        className={`w-full py-2 font-semibold rounded-md text-zinc-900 bg-zinc-200 hover:bg-zinc-300 transition-colors ${
          isSubmitting && "bg-zinc-500 cursor-wait"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </>
        ) : (
          "Create an Account"
        )}
      </button>
      {errors.root && (
        <p className="text-red-500  !mt-1">{errors.root?.message}</p>
      )}
      <p className="text-center ">
        Already have an account?{" "}
        <Link className="text-blue-500 hover:underline" href="/admin/auth/signup">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default OAuthSetupPage;
