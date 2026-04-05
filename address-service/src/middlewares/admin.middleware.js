import { ApiError } from '../utils/ApiError.js';

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ApiError(401, "Unauthorized: User role not found"));
        }

        const userRole = req.user.role.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return next(
                new ApiError(403, `Role ${req.user.role} is not allowed to access this resource`)
            );
        }
        
        next();
    };
};