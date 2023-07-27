import type { TokenSet } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { AppError } from "@our-trips/shared";
import logger from "@our-trips/shared/logger";

import { env } from "./env.mjs";

type GoogleRefreshTokenSet = TokenSet & {
  expires_in: number;
};

export async function refreshAccessToken(expiredToken: JWT) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: expiredToken.refreshToken ?? "",
  });
  const url = `https://oauth2.googleapis.com/token?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw await AppError.fromResponse(response);
    }
    const refreshToken = (await response.json()) as GoogleRefreshTokenSet;

    return {
      ...expiredToken,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
      refreshToken: refreshToken.refresh_token ?? expiredToken.refreshToken,
    };
  } catch (err) {
    logger.error(err, "Failed to refresh access token");
    return {
      ...expiredToken,
      isInvalid: true,
    };
  }
}
