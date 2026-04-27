import { toTitleCase } from "./common.utils.js";

export const getNotificationBody = (name, type, connectionStatus) => {
  if (type === "connection") {
    if (connectionStatus === "interested") {
      return `${toTitleCase(name)} sent you a connection request!`;
    } else {
      return `${toTitleCase(name)} accepted your connection request!`;
    }
  } else {
    return "Chat feature is not built yet!";
  }
};
