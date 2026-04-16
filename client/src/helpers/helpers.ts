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
