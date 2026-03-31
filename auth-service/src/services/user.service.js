import { User } from '../models/user.model.js';
import * as otpService from './otp.service.js';
import * as tokenService from './token.service.js';
import { generateOtp } from '../utils/generateOtp.js';
import ApiError from '../utils/ApiError.js';


export const registerUser = async (phone, password) => {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
        throw new ApiError(400, "Phone number already registered");
    }

    const user = await User.create({ phone, password });
    
    const otp = generateOtp();
    await otpService.saveOTP(phone, otp);

    return user;
};

export const verifyAndActivateUser = async (phone, otp) => {
    const isValid = await otpService.verifyOTP(phone, otp);
    if (!isValid) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    const user = await User.findOneAndUpdate(
        { phone }, 
        { is_verified: true }, 
        { returnDocument: 'after' }
    );
    
    if (!user) throw new ApiError(404, "User not found");
    
    return user;
};

export const loginUser = async (phone, password) => {
    const user = await User.findOne({ phone });
    
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid phone or password");
    }

    if (!user.is_verified) {
        throw new ApiError(403, "Account not verified. Please verify OTP first.");
    }

    const tokens = tokenService.generateTokens(user);
    
    return {
        user: {
            id: user._id,
            phone: user.phone,
            role: user.role
        },
        ...tokens
    };
};

export const processPasswordReset = async (phone, otp, newPassword) => {
    const isValid = await otpService.verifyOTP(phone, otp);
    if (!isValid) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    const user = await User.findOne({ phone });
    if (!user) throw new ApiError(404, "User not found");

    user.password = newPassword; 
    await user.save(); 

    return true;
};


export const findUserByPhone = async (phone) => {
    return await User.findOne({ phone });
};