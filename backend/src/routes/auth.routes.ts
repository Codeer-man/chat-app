import express from "express";
import { logout, signIn, signup } from "../controllers/auth.controller";
import { validation } from "../middleware/validation.middleware";
import { loginValidation, signupValidation } from "../validation/auth";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  SendOTPCode,
  verifyOTP,
} from "../controllers/emailVerification.controller";
import { arcjetProtection } from "../middleware/aj.middleware";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", validation(signupValidation), signup);
router.post("/login", validation(loginValidation), signIn);
router.get("/logout", authMiddleware, logout);

router.get("/sendOTP", authMiddleware, SendOTPCode);
router.post("/verifyOTP", authMiddleware, verifyOTP);

router.get("/checkUser", authMiddleware, (req, res) =>
  res.status(200).json((req as any).user)
);

export default router;
