import axios, { isAxiosError, Method } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

interface BaseOptions {
  endpointPath: string;
  statusShouldBe?: number;
  onError?: (err?: Error) => void;
  onSuccess?: (data: unknown) => void;
  fallbackErrorMessage?: string;
  returnNullIfError?: boolean;
  throwIfError?: boolean;
}

interface WithData extends BaseOptions {
  data: unknown;
}

class Fetcher {
  private readonly baseUrl: string;
  private readonly config = { withCredentials: true };

  constructor() {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error("NEXT_PUBLIC_API_URL is not defined");
    this.baseUrl = url;
  }

  private handleError(
    error: unknown,
    onError?: (err?: Error) => void,
    fallbackErrorMessage?: string
  ) {
    onError?.(error instanceof Error ? error : undefined);
    if (isAxiosError(error)) {
      toast.error(
        error.response?.data?.error ??
          fallbackErrorMessage ??
          "Something went wrong"
      );
    } else {
      console.error(error);
    }
  }

  private async request<T>(
    method: Method,
    endpointPath: string,
    data: unknown | undefined,
    {
      statusShouldBe = 200,
      onError,
      onSuccess,
      fallbackErrorMessage,
      returnNullIfError = false,
      throwIfError = false,
    }: BaseOptions
  ) {
    try {
      const response = await axios.request<T>({
        url: `${this.baseUrl}${endpointPath}`,
        method,
        data,
        ...this.config,
      });

      if (response.status !== statusShouldBe) onError?.();

      if (!response.data) throw new ApiError(500, "No data found");

      onSuccess?.(response.data);

      return response.data;
    } catch (error) {
      this.handleError(error, onError, fallbackErrorMessage);
      if (throwIfError) throw error;
      return returnNullIfError ? null : (error as unknown);
    }
  }

  get<T>(options: BaseOptions) {
    return this.request<T>("GET", options.endpointPath, undefined, options);
  }

  post<T>(options: WithData) {
    return this.request<T>("POST", options.endpointPath, options.data, options);
  }

  patch<T>(options: WithData) {
    return this.request<T>("PATCH", options.endpointPath, options.data, options);
  }
}

const fetcher = new Fetcher();
export default fetcher;
