import type { AxiosError } from "axios";
import axios from "axios";

const checkAuthError = async (err: AxiosError) => {
  if (
    axios.isAxiosError(err) &&
    err.response?.status === 401 &&
    err.response?.data &&
    typeof err.response.data === "object" &&
    "code" in err.response.data
  ) {
    const errorCode = (err.response.data as { code: string }).code;
    if (errorCode === "UNAUTHORIZED") {
      try {
        const refresh = await axios.post(
          `${process.env.SERVER_ENDPOINT}/users/refresh`,
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
