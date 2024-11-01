const ExpressError = require("../utils/expressError.js");
const userService = require("../service/userService.js");
const jwt = require("jsonwebtoken");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const rateLimiter = new RateLimiterMemory({
  points: 3, // Number of allowed requests
  duration: 3600, // 1 hour in seconds
});


module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userInfo = {
    email,
    password,
  };
  const user = await userService.authenticateUser(userInfo);
  if (!user) {
    throw new ExpressError("Wrong email or password", 404);
  }
 // Generate and set tokens
 const refreshToken =await userService.generateUserToken(user._id,res);
 // Send the refresh token in the response body
 res.status(200).json({refreshToken:refreshToken});

};

module.exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    await rateLimiter.consume(email);
  } catch (rejRes) {
    throw new ExpressError("Rate limit exceeded. Please try again later.", 429);
  }
  const sendResetPass = await userService.sendResetPassEmail(email);
  if (!sendResetPass) {
    throw new ExpressError("User not found", 404);
  }
  res.json({
    message: "Password reset email sent successfully check Your Email",
  });
};


module.exports.resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;
  const info = {
    resetToken,
    newPassword,
  };
  const user = await userService.resetPassword(info);
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  res.status(200).json({ message: "Password reset successful" });
};

module.exports.getUserInfo = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  res.json(user);
};

module.exports.updateUser = async (req, res) => {
  const userId = req.user._id;
  const { email, fullName } = req.body;
  const userInfo = { userId, email, fullName };
  const updateUser = await userService.updateUser(userInfo);
  if (!updateUser) {
    throw new ExpressError("User not Updated", 404);
  }
  res.status(200).json({ message: "User updated successful." });
};


module.exports.logoutUser = (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
};

module.exports.refreshUserToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)  throw new ExpressError("You must be logged in first", 401);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userID: decoded.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600 * 1000, // 1 hour
    });

    res.status(200).json({refreshToken:refreshToken});
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};