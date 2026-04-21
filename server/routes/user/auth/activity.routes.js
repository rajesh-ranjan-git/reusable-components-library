import express from "express";
import { PERMISSIONS } from "../../../constants/permission.constants.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";
import {
  clearMyActivity,
  getActivityTypes,
  getMyActivity,
} from "../../../controllers/user/auth/activity.controller.js";

const activityRouter = express.Router();

activityRouter.get(
  "/activity",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ACTIVITY_READ_OWN] }),
  getMyActivity,
);
activityRouter.get(
  "/activity/types",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ACTIVITY_READ_OWN] }),
  getActivityTypes,
);
activityRouter.delete(
  "/activity/clear",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ACTIVITY_RESET_OWN] }),
  clearMyActivity,
);

export default activityRouter;
