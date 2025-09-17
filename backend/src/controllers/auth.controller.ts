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
      const token = generateToken(newUser._id, res);

      await sendWelcomeEmail(email, fullname, process.env.CLIENT_URL!);
      res.status(201).json({
        message: "New user has been created",
        status: true,
        token,
      });
    } else {
      res.status(401).json({ message: "Something went wrong", status: false });
    }
  } catch (error) {
    console.error(error);
    throw throwError("Invalid server error");
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email) {
      throwError("Please enter email or username");
    } else if (!password) {
      throwError("Please enter the password");
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      throwError("User does not exist! Sign In to contiue");
    }
    console.log(findUser);

    //comparePassword
    const comparePassword = bcrypt.compare(password, findUser?.password!);
    if (!comparePassword) {
      throwError("Password does not match", 403);
    }

    const token = generateToken(findUser?._id!, res);

    res.status(201).json({
      success: true,
      message: "welcome back",
      // cookie: token.cookie,
      token: token.token,
    });
  } catch (error) {
    console.error(error);
    throwError("Invalid server Error");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      throwError("Cookie not found", 404);
    }

    res.clearCookie(token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User has been logout ",
      success: true,
    });
  } catch (error) {
    throwError("Invlaid server Error", 500);
  }
};
