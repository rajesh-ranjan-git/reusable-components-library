import { ALLOWED_TYPES, MAX_IMAGE_SIZE } from "@/constants/common.constants";
import { LoggedInUserType } from "@/types/types";
import { toTitleCase } from "@/utils/common.utils";

export const getFullName = (user: LoggedInUserType) => {
  if (!user) return;

  if (user.profile?.firstName && user.profile?.lastName) {
    return toTitleCase(`${user.profile.firstName} ${user.profile.lastName}`);
  } else if (user?.profile?.firstName) {
    return toTitleCase(user.profile.firstName);
  } else if (user?.profile?.lastName) {
    return toTitleCase(user.profile.lastName);
  } else if (user?.profile?.userName) {
    return user.profile.userName;
  } else if (user?.email) {
    return user.email;
  } else {
    return "John Doe";
  }
};

export const validateImage = (image: File) => {
  if (!ALLOWED_TYPES.includes(image.type)) {
    throw new Error("Only JPG, PNG, WEBP allowed");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be less than 2MB");
  }
};

export const dataURLtoImage = async (dataUrl: string, imageName: string) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], imageName, { type: blob.type });
};

export const compressImage = async (image: File): Promise<File> => {
  const compressedImage = new Image();
  compressedImage.src = URL.createObjectURL(image);

  await new Promise((resolve) => (compressedImage.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const MAX_WIDTH = 800;

  const scale = Math.min(1, MAX_WIDTH / compressedImage.width);

  canvas.width = compressedImage.width * scale;
  canvas.height = compressedImage.height * scale;

  ctx.drawImage(compressedImage, 0, 0, canvas.width, canvas.height);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(resolve as any, "image/jpeg", 0.7),
  );

  return new File([blob], image.name, { type: "image/jpeg" });
};
