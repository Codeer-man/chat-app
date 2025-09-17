import { RequestHandler } from "express";
import { throwError } from "../lib/utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/User";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    console.log(decode);

    const user = await User.findById({ _id: decode.id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    (req as any).id = user.id;
    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
