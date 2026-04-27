import { httpStatusConfig } from "../../config/http.config.js";
import { DEFAULT_PAGE_SIZE } from "../../constants/common.constants.js";
import Connection from "../../models/connection/connection.model.js";
import Notification from "../../models/notification/notification.model.js";
import Profile from "../../models/user/profile/profile.model.js";
import { getNotificationBody } from "../../utils/notification.utils.js";
import { validateConnectionStatus } from "../../validators/connection.validator.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";

export const connect = async (req, res) => {
  const userId = await req.data.userId;
  const { userId: otherUserId } = await req.data.params;
  const { status: connectionStatus } = await req.data.body;

  if (userId === otherUserId) {
    throw AppError.badRequest({
      message: "You cannot send connection request to yourself!",
      code: "CONNECTION REQUEST FAILED",
    });
  }

  const validatedConnectionStatus = validateConnectionStatus(connectionStatus);

  const existingConnection = await Connection.findOne({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).lean();

  let connectionToCreate = { lastActionedBy: userId };
  let connectionToUpdate = { lastActionedBy: userId };
  let notificationObject = {};

  switch (validatedConnectionStatus) {
    case "interested":
      if (!existingConnection) {
        connectionToCreate = {
          senderId: userId,
          receiverId: otherUserId,
          connectionStatus: validatedConnectionStatus,
          ...connectionToCreate,
        };

        notificationObject = {
          type: "connection",
          title: "You have a new connection request!",
          to: otherUserId,
          from: userId,
          connectionStatus: validatedConnectionStatus,
        };
        break;
      }

      if (
        existingConnection.connectionStatus !== "not-interested" &&
        existingConnection.connectionStatus !== "rejected"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "rejected" &&
        (existingConnection.rejectedBySenderCount >= 5 ||
          existingConnection.rejectedByReceiverCount >= 5)
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        rejectedBySenderCount:
          existingConnection.senderId.toString() === userId
            ? 0
            : existingConnection.rejectedBySenderCount,
        rejectedByReceiverCount:
          existingConnection.receiverId.toString() === userId
            ? 0
            : existingConnection.rejectedByReceiverCount,
        ...connectionToUpdate,
      };

      break;

    case "not-interested":
      if (!existingConnection) {
        connectionToCreate = {
          senderId: userId,
          receiverId: otherUserId,
          connectionStatus: validatedConnectionStatus,
          ...connectionToCreate,
        };

        break;
      }

      if (existingConnection.connectionStatus === "accepted") {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "rejected" &&
        (existingConnection.rejectedBySenderCount >= 5 ||
          existingConnection.rejectedByReceiverCount >= 5)
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "blocked" &&
        existingConnection.lastActionedBy.toString() !== userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      break;

    case "accepted":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "interested" ||
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      notificationObject = {
        type: "connection",
        title: "You have a new connection request!",
        to: otherUserId,
        from: userId,
        connectionStatus: validatedConnectionStatus,
      };

      break;

    case "rejected":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "interested" &&
        existingConnection.connectionStatus !== "accepted"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      let rejectedBySenderCount = 0;
      let rejectedByReceiverCount = 0;
      let newConnectionStatus = "rejected";

      if (existingConnection.senderId.toString() === userId) {
        rejectedBySenderCount = existingConnection.rejectedBySenderCount + 1;

        if (rejectedBySenderCount >= 5) {
          newConnectionStatus = "blocked";
          rejectedBySenderCount = 0;
        }
      } else if (existingConnection.receiverId.toString() === userId) {
        rejectedByReceiverCount =
          existingConnection.rejectedByReceiverCount + 1;

        if (rejectedByReceiverCount >= 5) {
          newConnectionStatus = "blocked";
          rejectedByReceiverCount = 0;
        }
      }

      connectionToUpdate = {
        connectionStatus: newConnectionStatus,
        rejectedBySenderCount,
        rejectedByReceiverCount,
        ...connectionToUpdate,
      };

      break;

    case "blocked":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "accepted" &&
        existingConnection.connectionStatus !== "interested"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              senderId: existingConnection.senderId.toString(),
              receiverId: existingConnection.receiverId.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      break;

    default:
      throw AppError.badRequest({
        message: "Invalid connection request!",
        code: "CONNECTION REQUEST FAILED",
        details: {
          status: validatedConnectionStatus,
          existingConnection: {
            senderId: existingConnection.senderId.toString(),
            receiverId: existingConnection.receiverId.toString(),
            connectionStatus: existingConnection.connectionStatus,
          },
        },
      });
  }

  const connection = connectionToCreate.senderId
    ? await Connection.create(connectionToCreate)
    : await Connection.findOneAndUpdate(
        {
          $or: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        { $set: connectionToUpdate },
        { returnDocument: "after", upsert: false, runValidators: true },
      );

  if (!connection) {
    throw AppError.internal({
      message: "Unable to send connection request!",
      code: "CONNECTION REQUEST FAILED",
      details: { connection },
    });
  }

  if (notificationObject && Object.values(notificationObject).length > 0) {
    const { firstName } = await Profile.findOne({
      user: connection.senderId,
    })
      .select("-_id firstName")
      .lean();

    notificationObject.body = getNotificationBody(
      firstName,
      notificationObject.type,
      notificationObject.connectionStatus,
    );

    const notifications = await Notification.create(notificationObject);

    if (!notifications) {
      logger.warn(
        "🚨 [NOTIFICATION FAILED] Failed to send connection notification!",
        notifications,
      );
    }
  }

  return responseService.successResponseHandler(req, res, {
    status: "CONNECTION REQUEST SUCCESS",
    message: "Connection request sent successfully!",
    data: { connection },
  });
};
