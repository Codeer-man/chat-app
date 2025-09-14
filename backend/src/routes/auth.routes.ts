import express from "express";
import { signup } from "../controllers/auth.controller";
import { validation } from "../middleware/validation.middleware";
import { signupValidation } from "../validation/auth";

const router = express();

router.post("/signup", validation(signupValidation), signup);

export default router;
