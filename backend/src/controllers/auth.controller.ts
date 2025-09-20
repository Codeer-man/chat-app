import { Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcryptjs";
import { generateToken, throwError } from "../lib/utils";
import { sendWelcomeEmail } from "../email/email.hanlder";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password, confirmPassword, profilePic } = req.body;

  try {
    if (!fullname || !email || !password || !confirmPassword) {
      throwError("PLease fill all the fileds", 400);
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      throwError("EMail already exists", 400);
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      profilePic,
    });

    await newUser.save();

    const token = generateToken(newUser._id, res);
    await sendWelcomeEmail(email, fullname, process.env.CLIENT_URL!);

    res.status(201).json({
      message: "New user has been created",
      status: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid server error", status: false });
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
    const token = (req as any).token;

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
