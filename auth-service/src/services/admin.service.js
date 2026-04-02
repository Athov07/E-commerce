import { User } from '../models/user.model.js';

// Get all users from the database
export const getAllUsers = async () => {
  return await User.find({}).select('-password'); // Exclude passwords for security
};

// Update a user's role or status
export const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');
};

// Delete a user
export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

// Get stats for the dashboard
export const getStats = async () => {
  const totalUsers = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: 'admin' });
  const sellerCount = await User.countDocuments({ role: 'seller' });
  
  return {
    totalUsers,
    adminCount,
    sellerCount,
    recentJoined: await User.find().sort({ createdAt: -1 }).limit(5).select('phone role')
  };
};