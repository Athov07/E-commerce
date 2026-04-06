import * as profileService from "../services/profile.service.js";
import { Profile } from "../models/profile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { publishProfileUpdated } from "../kafka/producers/profile.producer.js";

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  const profile = await Profile.findOne({ userId });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  res.status(200).json(profile);
});

export const editProfile = asyncHandler(async (req, res) => {
  const updated = await profileService.updateProfileData(
    req.user.id,
    req.body,
    req.file,
  );
  if (updated) {
    await publishProfileUpdated(updated);
    console.log(`Event Published: Profile updated for user ${req.user.id}`);
  }
  res.status(200).json(updated);
});

export const getAllProfiles = asyncHandler(async (req, res) => {
  const profiles = await Profile.find();
  res.status(200).json(profiles);
});
