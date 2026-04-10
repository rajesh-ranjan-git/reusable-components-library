import express from "express";
import {
  deleteSocialLink,
  getSocialLinks,
  getSocialLinksByUser,
  updateSocialLinks,
} from "../../controllers/auth/social.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Social from "../../models/auth/socialLink.model.js";

const socialRouter = express.Router();

socialRouter.get(
  "/social",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getSocialLinks,
);
socialRouter.get(
  "/social/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userId",
      model: Social,
      ownerIdField: "user",
    },
    enforceOwnership: true,
  }),
  getSocialLinksByUser,
);
socialRouter.patch(
  "/social",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateSocialLinks,
);
socialRouter.delete(
  "/social/:platform",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  deleteSocialLink,
);

export default socialRouter;
