const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../utils/expressError.js");
const authUtils = require("../utils/auth.js");
const {sendResetPasswordEmail,} = require("../setup/nodemailer.js");
const crypto = require("crypto");

const authenticateUser = async (userInfo) => {
  const { password, email } = userInfo;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError("No User With this Credinals", 404);
  }
  const authenticated = await authUtils.authenticateUser(
    password,
    user.password
  );
  if (!authenticated) {
    throw new ExpressError("Wrong email or password", 404);
  }
  return user;
};

  const generateUserToken = (userID, res) => {
    // Generate Access Token (short-lived)
    const accessToken = jwt.sign({ userID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    // Generate Refresh Token (longer-lived)
    const refreshToken = jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    // Set the Access Token as an HTTP-only cookie
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict",
      maxAge: 3600 * 1000, // 1 hour
    });
  
    // Return Refresh Token
    return refreshToken;
  };


const sendResetPassEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError("No User Found With This Email", 404);
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000;
  sendResetPasswordEmail(user.email, resetToken);
  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();
  return user;
};

const resetPassword = async (info) => {
  const { resetToken, newPassword } = info;
  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ExpressError("IInvalid or expired reset token", 400);
  }
  user.password = await authUtils.hashPassword(newPassword);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
  return user;
};


const updateUser = async (userInfo) => {
  const { userId, fullName, email } = userInfo;
  const user = await User.findById(userId);
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  user.fullName = fullName;
  user.email = email;
  await user.save();
  return user;
};

const userService = {
  generateUserToken,
  authenticateUser,
  sendResetPassEmail,
  resetPassword,
  updateUser,
};

module.exports = userService;


