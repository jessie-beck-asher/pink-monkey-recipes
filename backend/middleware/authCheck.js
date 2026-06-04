import jwt from "jsonwebtoken";
import HttpError from "../models/http-error.js";

const authCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError("Authentication required.", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    req.memberData = jwt.verify(token, process.env.JWT_KEY);
  } catch {
    return next(new HttpError("Invalid or expired token.", 401));
  }

  next();
};

export default authCheck;
