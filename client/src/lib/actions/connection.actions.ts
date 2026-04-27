import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const connect = async (
  userId: string,
  status: string,
): Promise<ApiResponseType> => {
  try {
    return await api.post(
      `${apiUrls.connection.connect}/${userId}`,
      { status },
      {
        requireAuth: true,
      },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
