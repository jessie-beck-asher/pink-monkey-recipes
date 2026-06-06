import Member from "../models/member.js";
import HttpError from "../models/http-error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);
  } catch (err) {
    return next(new HttpError("Failed to hash password.", 500));
  }

  if (!username || !password) {
    return next(new HttpError("Username and password are required.", 400));
  }

  let member;
  try {
    member = await Member.findOne({ username });
  } catch (err) {
    return next(new HttpError("Login failed, please try again.", 500));
  }

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, member.password);
  } catch (err) {
    return next(new HttpError("Login failed, please try again.", 500));
  }

  if (!member || !validPassword) {
    return next(new HttpError("Error with username or password.", 401));
  }

  let token;
  try {
    token = jwt.sign({ memberId: member.id }, process.env.JWT_KEY, {
      expiresIn: "4h",
    });
  } catch (err) {
    return next(new HttpError("Login failed, please try again.", 500));
  }

  res.json({ username: member.username, token });
};
