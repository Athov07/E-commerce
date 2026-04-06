import mongoose from "mongoose";
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);
export const Profile = mongoose.model("Profile", profileSchema);
