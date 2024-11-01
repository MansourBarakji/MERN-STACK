const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const productControllers = require("../controllers/product");
const { validateProduct  } = require("../middleware/auth");
const { storage } = require("../cloudinary/index"); 
const multer = require("multer");
const upload = multer({ storage });


// products search
router.post("/search", asyncHandler(productControllers.productSearch));
//edit Product
// router.put("/editProduct", asyncHandler(productControllers.updateProduct));
// get product
router.post("/info", asyncHandler(productControllers.getProduct));
//delete Product 
// router.delete("/:productId",asyncHandler(productControllers.deleteProduct));



module.exports = router;
