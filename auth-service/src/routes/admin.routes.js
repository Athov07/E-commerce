import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import * as adminCtrl from '../controllers/admin.controller.js';

const router = express.Router();

// Option A: Apply to every single route in this file
router.use(protect);
router.use(authorize('admin')); 

// Now define your routes simply
router.get('/users', adminCtrl.getAllUsers);
router.get('/stats', adminCtrl.getDashboardStats);
router.delete('/users/:id', adminCtrl.deleteUser);

export default router;