import mongoose from "mongoose";

interface UserI {
  fullname: string;
  email: string;
  password: string;
  profilePic: string;
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
  },
  {
    timestamps: true, // store time series
  }
);

const User = mongoose.model("User", userScehma);

export default User;
