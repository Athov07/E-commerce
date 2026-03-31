import { User } from '../models/user.model.js';
import { AuditLog } from '../models/auditLog.model.js';

export const getAllUsers = async () => {
  return await User.find({}).select('-password');
};

export const createAuditLog = async (data) => {
  return await AuditLog.create(data);
};