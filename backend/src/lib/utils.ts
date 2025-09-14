import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (userId: Types.ObjectId, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict",
  });

  return token;
};

export const throwError = (message: string, statusCode = 500) => {
  const err: any = new Error(message);
  err.statusCode = statusCode;
  err.success = false;
  return err;
};
