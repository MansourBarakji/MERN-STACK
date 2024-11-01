const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/order");
const asyncHandler = require("express-async-handler");

// create Cart
router.post("/", asyncHandler(cartControllers.createCart));
//get User Orders
router.get("/user", asyncHandler(cartControllers.getUserOrders));
//complete Order
router.put("/processed", asyncHandler(cartControllers.completeOrder));
//cancel Order
router.post("/cancelled", asyncHandler(cartControllers.cancelOrder));
//restore Order
router.post("/restored", asyncHandler(cartControllers.restoreOrder));
//delete Order
router.post("/deleteOrder", asyncHandler(cartControllers.deleteOrder));

module.exports = router;
