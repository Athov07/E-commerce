import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.get('/stats', protect, isAdmin, getDashboardStats);

export default router;