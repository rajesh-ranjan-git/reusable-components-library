import { oAuthService } from "../services/oauth/oauth.service.js";
import { asyncHandler, toTitleCase } from "../utils/common.utils.js";

export const oauthVerifyMiddleware = asyncHandler(async (req, res, next) => {
  const { provider } = req.data.params;
  const { token } = req.data.body;

  if (!token) {
    throw AppError.unprocessable({
      message: `Please provide OAuth token for ${toTitleCase(provider)}!`,
      code: "OAUTH VALIDATION FAILED",
      details: { token },
    });
  }

  if (!["google", "github", "facebook", "linkedin"].includes(provider)) {
    throw AppError.unprocessable({
      message: "Provider must be google, guthub, facebook or linkedin only!",
      code: "OAUTH VALIDATION FAILED",
      details: { token },
    });
  }

  let profile;

  if (provider === "google") {
    profile = await oAuthService.verifyGoogleToken(token);
  }

  if (provider === "github") {
    profile = await oAuthService.verifyGithubToken(token);
  }

  if (provider === "facebook") {
    profile = await oAuthService.verifyFacebookToken(token);
  }

  if (provider === "linkedin") {
    profile = await oAuthService.verifyLinkedinToken(token);
  }

  req.data.oauthProfile = profile;

  next();
});
