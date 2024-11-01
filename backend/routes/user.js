const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");
const asyncHandler = require("express-async-handler");

// User login
router.post("/login", asyncHandler(userControllers.loginUser));
// Get user information
router.get("/profile", asyncHandler(userControllers.getUserInfo));
// Update user information
router.put("/editProfile", asyncHandler(userControllers.updateUser));
// Send reset password email
router.post(
  "/sendResetPasswordEmail",
  asyncHandler(userControllers.sendResetPasswordEmail)
);
// Reset password
router.post("/resetPassword", asyncHandler(userControllers.resetPassword));
//refreshToken 
router.get("/refreshUserToken", asyncHandler(userControllers.refreshUserToken));
//logout 
router.get("/logout", asyncHandler(userControllers.logoutUser));


module.exports = router;
