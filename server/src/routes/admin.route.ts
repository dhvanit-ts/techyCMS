import { Router } from "express";
import {
  registerUser,
  initializeUser,
  getUserData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendOtp,
  verifyOtp,
  getUserById,
  updateUser,
  searchUsers,
  googleCallback,
  handleUserOAuth,
  handleTempToken,
} from "../controllers/admin.controller";
import { verifyAdminJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/initialize").post(initializeUser);
router.route("/me").get(verifyAdminJWT, getUserData);
router.route("/id/:userId").get(verifyAdminJWT, getUserById);
router.route("/login").post(loginUser);
router.route("/auth/finalize").post(handleTempToken);
router.route("/logout").post(verifyAdminJWT, logoutUser);
router.route("/update").put(verifyAdminJWT, updateUser);
router.route("/search/:query").get(verifyAdminJWT, searchUsers);
router.route("/refresh").post(refreshAccessToken);
router.route("/otp/send").post(sendOtp);
router.route("/otp/verify").post(verifyOtp);
router.route("/google/callback").get(googleCallback);
router.route("/oauth").post(handleUserOAuth);

export default router;