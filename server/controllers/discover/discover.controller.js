import { isValidObjectId } from "mongoose";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../constants/common.constants.js";
import { RESTRICTED_ROLES, ROLES } from "../../constants/roles.constants.js";
import { httpStatusConfig } from "../../config/http.config.js";
import User from "../../models/user/auth/user.model.js";
import Account from "../../models/user/auth/account.model.js";
import Profile from "../../models/user/profile/profile.model.js";
import Role from "../../models/user/rbac/role.model.js";
import UserRole from "../../models/user/rbac/user.role.model.js";
import Session from "../../models/user/auth/session.model.js";
import ActivityLog from "../../models/user/auth/activity.log.model.js";
import {
  asyncHandler,
  omitObjectProperties,
} from "../../utils/common.utils.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import { sessionService } from "../../services/auth/session.service.js";
import AppError from "../../services/error/error.service.js";
import { activityService } from "../../services/activity/activity.service.js";
import { responseService } from "../../services/response/response.service.js";

export const discoverProfiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = req.data.query;

  const currentUserId = req.data.userId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const restrictedRoles = await Role.find({
    name: { $in: RESTRICTED_ROLES },
  })
    .select("_id")
    .lean();

  const restrictedRoleIds = restrictedRoles.map((r) => r._id);

  const restrictedUsers = await UserRole.find({
    role: { $in: restrictedRoleIds },
  })
    .select("user")
    .lean();

  const restrictedUserIds = restrictedUsers.map((u) => u.user.toString());

  const filter = {
    user: {
      $nin: [...restrictedUserIds, currentUserId],
    },
  };

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { headline: { $regex: search, $options: "i" } },
    ];
  }

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .populate("user", "status lastSeen")
      .populate({
        path: "address",
        select: "city state country location",
      })
      .select("-_id -updatedAt -__v -avatarFileId -coverFileId -interests")
      .skip(skip)
      .limit(limitNum),
    Profile.countDocuments(filter),
  ]);

  const users = profiles.filter((profile) => profile.user?.status === "active");

  const normalizedUsers = sanitizeMongoData(users).map((user) => ({
    userId: user.user.id,
    location: user.address?.location ?? null,
    ...omitObjectProperties(user, [
      "id",
      "user",
      "createdAt",
      "dob",
      "gender",
      "maritalStatus",
      "phone",
      "experiences",
      "skills",
    ]),
  }));

  return responseService.successResponseHandler(req, res, {
    status: "DISCOVER FETCH SUCCESS",
    message: "Profiles fetched successfully!",
    data: {
      users: normalizedUsers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});
