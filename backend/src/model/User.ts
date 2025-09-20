import mongoose from "mongoose";

interface UserI {
  fullname: string;
  email: string;
  password: string;
  profilePic: string;
  verified: Boolean;
  otp: Number;
  otpExpiresAt: Date;
}

const userScehma = new mongoose.Schema<UserI>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: () => Date.now() + 10 * 60 * 1000, // 10 min expiry
    },
  },
  {
    timestamps: true, // store time series
  }
);

const User = mongoose.model("User", userScehma);

export default User;
