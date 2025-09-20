import { Request, Response } from "express";
import { emailVerification } from "../email/email.hanlder";
import { throwError } from "../lib/utils";
import User from "../model/User";

export const SendOTPCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const email = user.email;

    const otp = Math.floor(10000000 + Math.random() * 90000000);
    await User.updateOne({ otp: otp });

<<<<<<< HEAD
    // await emailVerification(email, otp);
=======
    await emailVerification(email, otp);
>>>>>>> auth

    res.status(201).json({
      success: true,
      messsage: "OTP send ",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
    return;
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const otp = req.body;
    const user = (req as any).user;

    if (user.otp !== otp) {
      throwError("Invalid OTP");
    }

    if (user.otpExpiresAt < new Date()) {
      throwError("OTP expired");
    }

    await User.updateOne({ verified: true });

    res.status(200).json({ message: "Your email is verified", success: true });
  } catch (error) {
    console.error(error);
    throwError("Invalid server error");
  }
};
