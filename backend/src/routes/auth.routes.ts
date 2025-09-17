import express from "express";
import { logout, signIn, signup } from "../controllers/auth.controller";
import { validation } from "../middleware/validation.middleware";
import { loginValidation, signupValidation } from "../validation/auth";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express();

router.post("/signup", validation(signupValidation), signup);
router.post("/login", validation(loginValidation), signIn);
router.get("/logout", logout);

export default router;
