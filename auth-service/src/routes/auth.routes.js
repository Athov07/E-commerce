import express from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authCtrl.register);
router.post('/verify', authCtrl.verifyOtp); 
router.post('/login', authCtrl.login);
router.post('/resend-otp', authCtrl.resendOtp);
router.post('/forget-password', authCtrl.forgetPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/logout', protect, authCtrl.logout);

export default router;