import express from "express";
import { validateRequest } from "../../validators/request.validator.js";
import { subscribe } from "../../controllers/pushNotifications/pushNotifications.controller.js";

const pushNotificationsRouter = express.Router();

pushNotificationsRouter.post(
  "/subscribe",
  validateRequest({ requireBody: true }),
  subscribe,
);

export default pushNotificationsRouter;
