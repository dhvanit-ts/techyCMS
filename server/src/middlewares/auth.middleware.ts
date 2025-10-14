import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiHelpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import handleError from "../utils/handleError";
import { env } from "../conf/env";
import prisma from "../db";

const verifyAdminJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.__accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    if (!decodedToken || typeof decodedToken == "string") {
      throw new ApiError(401, "Invalid Access Token");
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!admin) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (!admin.refreshToken) {
      throw new ApiError(
        401,
        "Refresh token session is not valid",
      );
    }

    const mappedAdmin = {
      ...admin,
      password: null,
      refreshToken: null,
    };

    req.admin = mappedAdmin;
    next();
  } catch (error) {
    handleError(error, res, "Invalid Access Token", "UNAUTHORIZED");
  }
};

export { verifyAdminJWT };