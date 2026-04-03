import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) return next(new ApiError(401, "Not authorized, no token"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        next(new ApiError(401, "Token failed/expired"));
    }
};