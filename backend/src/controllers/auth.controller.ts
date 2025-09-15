import { Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcryptjs";
import { generateToken, throwError } from "../lib/utils";
import { sendWelcomeEmail } from "../email/email.hanlder";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password, confirmPassword, profilePic } = req.body;
  try {
    if (!fullname || !email || !password || !confirmPassword) {
      res
        .status(400)
        .json({ status: false, message: "Please fill all the fields" });
      throw throwError("please fill all the filed", 400);
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      res.status(400).json({ message: "email already exists", status: false });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      await sendWelcomeEmail(email, fullname, process.env.CLIENT_URL!);
      res.status(201).json({
        message: "New user has been created",
        status: true,
      });
    } else {
      res.status(401).json({ message: "Something went wrong", status: false });
    }
  } catch (error) {
    console.error(error);
    throw throwError("Invalid server error");
  }
};
