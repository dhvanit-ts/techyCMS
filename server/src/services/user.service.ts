import { env } from "../conf/env";
import { randomUUID } from "crypto";
import { ApiError } from "../utils/ApiHelpers";
import { Request } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";

class UserService {
  options: null | {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    domain?: string;
  } = null;
  accessTokenExpiry = 60 * 1000 * parseInt(env.ACCESS_TOKEN_LIFE || "0"); // In minutes
  refreshTokenExpiry =
    60 * 60 * 1000 * 24 * parseInt(env.REFRESH_TOKEN_LIFE || "0"); // In days

  constructor() {
    this.options = {
      httpOnly: true,
      secure: env.ENVIRONMENT === "production",
      ...(env.ENVIRONMENT === "production" ? {} : { domain: "localhost" }),
      sameSite:
        env.ENVIRONMENT === "production"
          ? ("none" as "none")
          : ("lax" as "lax"),
    };
  }

  async generateUuidBasedUsername(
    isUsernameTaken: (username: string) => Promise<boolean>,
    length = 12
  ) {
    const maxTries = 20;

    for (let i = 0; i < maxTries; i++) {
      const uuid = randomUUID().replace(/-/g, "").slice(0, length);

      const exists = await isUsernameTaken(uuid);
      if (!exists) {
        return uuid;
      }
    }

    // Fallback username in case of failure
    const fallbackUsername = `User${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;
    return fallbackUsername;
  }

  generateAccessToken(id: string, username: string) {
    return jwt.sign(
      {
        id,
        username,
      },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(env.ACCESS_TOKEN_LIFE || "0")}m`,
      }
    );
  }

  generateRefreshToken(id: string, username: string) {
    return jwt.sign(
      {
        id,
        username,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(env.REFRESH_TOKEN_LIFE || "0")}d`,
      }
    );
  }

  async generateAccessAndRefreshToken(userId: string, req: Request) {
    try {
      const user = await prisma.admin.findUnique({
        where: { id: userId },
      });

      if (!user) throw new ApiError(404, "User not found");

      const accessToken = this.generateAccessToken(user.id, user.username);
      const refreshToken = this.generateRefreshToken(user.id, user.username);

      const rawIp =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.ip;

      const ip = (Array.isArray(rawIp) ? rawIp[0] : rawIp || "")
        .split(",")[0]
        .trim();

      await prisma.admin.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return { accessToken, refreshToken, ip };
    } catch (error) {
      console.log(error);
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  }
}

export default UserService;