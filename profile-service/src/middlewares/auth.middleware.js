import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new ApiError(401, "Unauthorized: No token provided");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    req.user = {
      ...decoded,
      _id: decoded.id || decoded._id 
    };
    
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};