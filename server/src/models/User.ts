import mongoose, { Document, Schema } from "mongoose";
import { ROLE, role } from "../utils/contents";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: role;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser> (
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
    },

    role: {
      type: String,
      enum: ROLE,
      default: "Member"
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;