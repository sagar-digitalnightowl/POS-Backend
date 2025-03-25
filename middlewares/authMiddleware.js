import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET; 

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next(); // Proceed to next middleware/controller
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
