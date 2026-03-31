import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/user.service.js";
import * as otpService from "../services/otp.service.js";
import { generateOtp } from "../utils/generateOtp.js";
import {
  publishUserRegistered,
  publishAuthEvent,
} from "../kafka/producers/auth.producer.js";

// Register a new user
export const register = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await authService.registerUser(phone, password);

  await publishUserRegistered({
    userId: user._id,
    phone: user.phone,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: "User created. Check terminal for OTP.",
  });
});



// Login user
export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await authService.loginUser(phone, password);

  await publishAuthEvent({
    userId: user._id,
    action: "LOGIN",
    timestamp: new Date(),
  });
  res.status(200).json({
    success: true,
    ...user,
  });
});



// Verify OTP for registration
export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const user = await authService.verifyAndActivateUser(phone, otp);

  await publishAuthEvent({
    userId: user._id,
    action: "ACCOUNT_VERIFIED",
    phone: phone,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Account verified successfully.",
  });
});



// Resend OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await authService.findUserByPhone(phone);
  if (!user) throw new ApiError(404, "User not found");

  const otp = generateOtp();
  await otpService.saveOTP(phone, otp);

  await publishAuthEvent({
    identifier: phone,
    action: "OTP_REQUESTED",
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "New OTP printed to terminal.",
  });
});



// Forget Password (Step 1: Send OTP)
export const forgetPassword = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await authService.findUserByPhone(phone);
  if (!user) throw new ApiError(404, "No account associated with this phone.");

  const otp = generateOtp();
  await otpService.saveOTP(phone, otp);

  await publishAuthEvent({
    identifier: phone,
    action: "OTP_REQUESTED",
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Reset OTP printed to terminal.",
  });
});



// Reset Password (Step 2: Update Password)
export const resetPassword = asyncHandler(async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  const user = await authService.processPasswordReset(phone, otp, newPassword);

  await publishAuthEvent({
    userId: user._id,
    action: "PASSWORD_RESET",
    phone: phone,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Password updated successfully. Please login.",
  });
});



// Logout
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await publishAuthEvent({
    userId,
    action: "LOGOUT",
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});
