import { redirect } from "next/navigation";
import checkAuthError from "../utils/checkAuthError";
import type { AxiosError } from "axios";

const useHandleAuthError = () => {
  const handleAuthError = async (error: AxiosError) => {
    const refreshed = await checkAuthError(error);
    if (!refreshed) {
      redirect("/admin/auth/signin");
    }
  };

  return { handleAuthError };
};

export default useHandleAuthError;
