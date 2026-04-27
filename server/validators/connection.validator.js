import AppError from "../services/error/error.service.js";

export const validateConnectionStatus = (connectionStatus) => {
  if (
    typeof connectionStatus !== "string" ||
    ![
      "interested",
      "not-interested",
      "accepted",
      "rejected",
      "blocked",
    ].includes(connectionStatus?.trim().toLowerCase())
  ) {
    throw AppError.unprocessable({
      message: "Please provide a valid connection status!",
      code: "CONNECTION REQUEST FAILED",
      details: { status: connectionStatus },
    });
  }

  return connectionStatus?.trim().toLowerCase();
};
