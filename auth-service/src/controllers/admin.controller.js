import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/admin.service.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});