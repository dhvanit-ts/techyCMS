import type { AxiosError } from "axios";
import axios from "axios";

const checkAuthError = async (err: AxiosError) => {
  if (
    axios.isAxiosError(err) &&
    err.response?.status === 401 &&
    err.response?.data &&
    typeof err.response.data === "object" &&
    "error" in err.response.data
  ) {
    const errorMessage = (err.response.data as { error: string }).error;
    if (errorMessage === "Unauthorized") {
      try {
        const refresh = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/refresh`,
          {},
          { withCredentials: true }
        );
        if (refresh.status !== 200) {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
  }
  return true;
};

export default checkAuthError;
