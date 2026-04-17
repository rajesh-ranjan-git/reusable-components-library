import { api, ApiErrorResponse, ApiResponse } from "../api/apiHandler";
import { apiUrls } from "../api/apiUtils";

type ImageTarget = "cover" | "avatar" | null;

export const uploadImage = async (
  image: File,
  type: ImageTarget,
  token: string,
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    return await api.post(`${apiUrls.profile.uploadImage}/${type}`, formData, {
      token,
    });
  } catch (error) {
    return error as ApiErrorResponse;
  }
};
