const ExpressError = require("../utils/expressError");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { productSchema, orderSchema } = require("../setup/joiSchemas");
const { UNAUTHORIZED_PATHS } = require("../constants/unauthorizedPaths");

module.exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  if (UNAUTHORIZED_PATHS.includes(req.path)) {
    return next();
  }
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ExpressError("You must be logged in first", 401);
  }
  const refreshToken = authorization.split(" ")[1];

  if (!refreshToken) {
   throw new ExpressError("You must be logged in first", 401);
 }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userID: decoded.userID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the new access token as a cookie
    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600 * 1000,
    });

    const user = await User.findById(decoded.userID);
    if (!user) {
      throw new ExpressError("Unauthorized", 401);
    }
  
    // Attach user info to request
    req.user = user;
    next();
  } catch (error) {
    throw new ExpressError("Unauthorized", 401);
  }
  });

  
module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports.validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
