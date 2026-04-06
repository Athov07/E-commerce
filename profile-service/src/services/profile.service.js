import { Profile } from "../models/profile.model.js";
import cloudinary from "../config/cloudinary.js";

export const updateProfileData = async (userId, updateData, file) => {
  if (file) {
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader.upload_stream((error, result) => resolve(result)).end(file.buffer);
    });
    updateData.avatar_url = uploadResult.secure_url;
  }
  return await Profile.findOneAndUpdate({ userId }, { $set: updateData }, { new: true });
};