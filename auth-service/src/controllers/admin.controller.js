import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/admin.service.js';
import ApiError from '../utils/ApiError.js';

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users
  });
});

// GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  res.status(200).json({
    success: true,
    data: stats
  });
});

// PATCH /api/admin/users/:id
export const updateUserDetails = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  if (!user) throw new ApiError(404, "User not found");
  
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

// DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await adminService.deleteUser(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});