import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import User from "../../models/user/auth/user.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  connect,
  connections,
  requests,
} from "../../controllers/connection/connection.controller.js";

const connectionRouter = express.Router();

connectionRouter.post(
  "/connect/:userId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
    allowSameLevel: true,
  }),
  connect,
);

connectionRouter.get(
  "/connections",
  requestMiddleware({ requireQuery: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  connections,
);

connectionRouter.get(
  "/requests",
  requestMiddleware({ requireQuery: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  requests,
);

export default connectionRouter;
