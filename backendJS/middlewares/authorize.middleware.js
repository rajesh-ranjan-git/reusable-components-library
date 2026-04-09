import { PERMISSIONS } from "../constants/permission.constants.js";
import User from "../models/auth/user.model.js";
import {
  getHighestRoleLevel,
  getUserPermissions,
} from "../services/auth/rbac.service.js";
import AppError from "../errors/app.error.js";
import { asyncHandler } from "../utils/common.utils.js";

const getTargetId = async (data, ownership) => {
  if (!ownership) return null;

  let targetId = null;

  switch (ownership.type) {
    case "params":
      targetId = data.params?.[ownership.key];
      break;

    case "body":
      targetId = data.body?.[ownership.key];
      break;

    case "query":
      targetId = data.query?.[ownership.key];
      break;

    case "custom":
      if (typeof ownership.handler === "function") {
        targetId = await ownership.handler(req);
      }
      break;

    default:
      throw AppError.forbidden({
        message: "Invalid ownership configuration!",
        code: "AUTHORIZATION FAILED",
      });
  }

  return targetId;
};

export const authorize = ({
  permissions = [],
  ownership = null,
  enforceHierarchy = false,
  allowSuperAdmin = true,
}) =>
  asyncHandler(async (req, res, next) => {
    const user = req.data.user;
    const userId = req.data.userId;

    let userPermissions = user.permissions;

    if (!userPermissions) {
      userPermissions = await getUserPermissions(userId);
    } else {
      userPermissions = new Set(userPermissions);
    }

    if (allowSuperAdmin && userPermissions.has(PERMISSIONS.ALL)) {
      return next();
    }

    if (permissions.length) {
      const hasAccess = permissions.every((p) => userPermissions.has(p));

      if (!hasAccess) {
        throw AppError.forbidden({
          message:
            "You do not have sufficient permission to perform this activity!",
          code: "AUTHORIZATION FAILED",
        });
      }
    }

    let targetUserId = null;

    if (ownership) {
      targetUserId = await getTargetId(req, ownership);
    }

    if (ownership?.enforce) {
      if (!targetUserId || targetUserId.toString() !== userId.toString()) {
        throw AppError.forbidden({
          message: "You do not have permission to perform this activity!",
          code: "AUTHORIZATION FAILED",
        });
      }
    }

    if (enforceHierarchy && targetUserId) {
      const targetUser = await User.findById(targetUserId).populate("roles");

      if (!targetUser) {
        throw AppError.notFound({
          message: "Target user not found!",
          code: "USER NOT FOUND",
        });
      }

      const currentUserRoles = user.roles?.map((r) => r.name) || [];

      const targetUserRoles = targetUser.roles?.map((r) => r.name) || [];

      const currentLevel = getHighestRoleLevel(currentUserRoles);
      const targetLevel = getHighestRoleLevel(targetUserRoles);

      if (targetLevel >= currentLevel) {
        throw AppError.forbidden({
          message:
            "You cannot perform this action on a user with equal or higher role!",
          code: "HIERARCHY VIOLATION",
        });
      }
    }

    next();
  });
