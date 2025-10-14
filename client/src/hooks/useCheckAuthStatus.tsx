"use client";

import { useCallback, useEffect } from "react";
import useHandleAuthError from "./useHandleAuthError";
import fetcher from "@/utils/fetcher";
import { IAdmin } from "@/types/IAdmin";
import { AxiosError } from "axios";
import useAdminStore from "@/store/adminStore";

function useCheckAuthStatus() {
  const setAdmin = useAdminStore((s) => s.setAdmin);
  const { handleAuthError } = useHandleAuthError();

  const getUser = useCallback(async () => {
    try {
      await fetcher.get<{ data: IAdmin | null }>({
        endpointPath: "/admin/me",
        returnNullIfError: true,
        throwIfError: true,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error fetching user",
        onSuccess: (data: unknown) => {
          const userData = data as { data: IAdmin | null };
          if (userData?.data == null) return;
          setAdmin(userData.data);
        },
      });
    } catch (error) {
      handleAuthError(error as AxiosError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return null;
}

export default useCheckAuthStatus;
