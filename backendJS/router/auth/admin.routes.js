import express from "express";
import {
  assignRole,
  createRole,
  deleteRole,
  forceLogoutUser,
  getActivityLogs,
  getStats,
  getUser,
  hardDeleteUser,
  listRoles,
  listUsers,
  updateRole,
  updateUserStatus,
} from "../../controllers/auth/admin.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../constants/permission.constants.js";

const adminRouter = express.Router();

adminRouter.get(
  "/user/list",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_ANY] }),
  listUsers,
);
adminRouter.get(
  "/user",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_ANY] }),
  getUser,
);
adminRouter.patch(
  "/user/status",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_UPDATE_ANY] }),
  updateUserStatus,
);
adminRouter.post(
  "/user/logout",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_UPDATE_ANY] }),
  forceLogoutUser,
);
adminRouter.delete(
  "/user",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_DELETE_ANY] }),
  hardDeleteUser,
);
adminRouter.get(
  "/role/list",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_READ] }),
  listRoles,
);
adminRouter.post(
  "/role/create",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_CREATE] }),
  createRole,
);
adminRouter.post(
  "/role/assign",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_ASSIGN] }),
  assignRole,
);
adminRouter.patch(
  "/role",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_UPDATE] }),
  updateRole,
);
adminRouter.delete(
  "/role",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_DELETE] }),
  deleteRole,
);
adminRouter.get(
  "/activity",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ACTIVITY_READ_ANY] }),
  getActivityLogs,
);
adminRouter.get(
  "/stats",
  requestMiddleware({}),
  authenticate,
  authorize({
    permissions: [
      PERMISSIONS.USER_READ_ANY,
      PERMISSIONS.SESSION_READ_ANY,
      PERMISSIONS.ROLE_READ,
    ],
  }),
  getStats,
);

export default adminRouter;
