"use client";

import { useState } from "react";
import InputBox from "@/components/InputBox";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { handleGoogleOAuthRedirect } from "@/utils/googleOAuthRedirect";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fetcher from "@/utils/fetcher";

type SigninDataType = {
  email: string;
  password: string;
};

function SigninPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninDataType>({
    defaultValues: {
      email: "monparadhvanit@gmail.com",
      password: "123",
    },
  });

  const onSubmit: SubmitHandler<SigninDataType> = async (
    data: SigninDataType
  ) => {
    try {
      setLoading(true);

      await fetcher.post({
        endpointPath: "/admin/login",
        data,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error signing in",
        throwIfError: true,
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-zinc-800 border rounded-md text-zinc-100 w-96">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h3 className="text-3xl py-2">Sign In</h3>
        <InputBox
          id="email"
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="Enter your Email"
        />
        <InputBox
          id="password"
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          placeholder="Enter your Password"
        />
        <button
          disabled={loading}
          className="px-4 py-2 bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60"
        >
          Sign In
        </button>
        {errors.root?.message && (
          <span className=" text-red-500">{errors.root.message}</span>
        )}
      </form>
      <p className="flex justify-center items-center my-3 text-xs">
        <Separator className="shrink bg-zinc-500" />
        <span className="px-4 text-zinc-500 dark:text-zinc-500 text-xs">
          Or
        </span>
        <Separator className="shrink bg-zinc-500" />
      </p>
      <form onSubmit={handleGoogleOAuthRedirect}>
        <button className="px-4 py-2 flex justify-center items-center space-x-2.5 bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60">
          <FaGoogle />
          <span>Login with Google</span>
        </button>
      </form>
      <p className="text-center  pt-3">
        Don&apos;t have an account?{" "}
        <Link href="/admin/auth/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default SigninPage;
