// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import checkAuthError from "../utils/checkAuthError";
import type { AxiosError } from "axios";

const useHandleAuthError = () => {
//   const router = useRouter();
  const handleAuthError = async (error: AxiosError) => {
    const refreshed = await checkAuthError(error);
    if (!refreshed) {
      redirect("/auth/login");
    }
  };

  return { handleAuthError };
};

export default useHandleAuthError;
