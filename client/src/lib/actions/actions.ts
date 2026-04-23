import { api, ApiErrorResponse, ApiResponse } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const refreshTokens = async (): Promise<ApiResponse> => {
  try {
    return await api.post(apiUrls.auth.refresh);
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const fetchMe = async (): Promise<ApiResponse> => {
  try {
    return await api.get(apiUrls.auth.me, { requireAuth: true });
  } catch (error) {
    return error as ApiErrorResponse;
  }
};
