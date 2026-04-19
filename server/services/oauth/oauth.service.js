import { OAuth2Client } from "google-auth-library";
import { GOOGLE_OAUTH_CLIENT_ID } from "../../constants/env.constants.js";

class OAuthService {
  constructor() {
    this._client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);
  }

  verifyGoogleToken = async (accessToken) => {
    const ticket = await this._client.verifyIdToken({
      idToken: accessToken,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
      id: payload.sub,
      email: payload.email,
      displayName: payload.name,
      avatar: payload.picture,
      accessToken,
    };
  };

  verifyGithubToken = async (accessToken) => {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    let email = data.email;

    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails = await emailRes.json();
      email = emails.find((e) => e.primary)?.email;
    }

    return {
      id: data.id,
      email,
      displayName: data.name || data.login,
      avatar: data.avatar_url,
      accessToken,
    };
  };

  verifyFacebookToken = async (accessToken) => {
    const res = await fetch(
      `https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`,
    );

    const data = await res.json();

    return {
      id: data.id,
      email: data.email,
      displayName: data.name,
      avatar: data.picture?.data?.url,
      accessToken,
    };
  };

  verifyLinkedInToken = async (accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const [profileRes, emailRes] = await Promise.all([
      fetch("https://api.linkedin.com/v2/userinfo", { headers }),
      fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        { headers },
      ),
    ]);

    const profileData = await profileRes.json();
    const emailData = await emailRes.json();

    return {
      id: profileData.sub,
      email: emailData?.elements?.[0]?.["handle~"]?.emailAddress || null,
      displayName: profileData.name,
      avatar: profileData.picture,
      accessToken,
    };
  };
}

export const oAuthService = new OAuthService();
