import express from "express";
import {
  oauthCallback,
  getLinkedProviders,
  unlinkProvider,
} from "../../../controllers/user/auth/oauth.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { oauthVerifyMiddleware } from "../../../middlewares/oauth.middleware.js";

const oauthRouter = express.Router();

oauthRouter.post(
  "/provider/:provider",
  requestMiddleware({ requireParams: true, requireBody: true }),
  oauthVerifyMiddleware,
  oauthCallback,
);
oauthRouter.get(
  "/provider/:provider",
  requestMiddleware({ requireQuery: true, requireParams: true }),
  oauthVerifyMiddleware,
  oauthCallback,
);
oauthRouter.get("/provider", requestMiddleware({}), getLinkedProviders);
oauthRouter.delete(
  "/provider/unlink",
  requestMiddleware({ requireParams: true }),
  unlinkProvider,
);

export default oauthRouter;
