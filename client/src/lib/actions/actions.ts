import { api, ApiErrorResponse, ApiResponse } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const fetchMe = async (): Promise<ApiResponse> => {
  try {
    return await api.get(apiUrls.auth.me);
  } catch (error) {
    return error as ApiErrorResponse;
  }
};
