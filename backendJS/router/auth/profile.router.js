import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
  updateGender,
} from "../../controllers/auth/profile.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const profileRouter = express.Router();

profileRouter.get("/user", requestMiddleware({}), authenticate, getMyProfile);
profileRouter.get(
  "/user/:username",
  requestMiddleware({ requireParams: true }),
  authenticate,
  getUserProfile,
);
profileRouter.patch(
  "/user",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateProfile,
);
profileRouter.put(
  "/user/username",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateUsername,
);
profileRouter.post(
  "/user/gender",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateGender,
);

export default profileRouter;
