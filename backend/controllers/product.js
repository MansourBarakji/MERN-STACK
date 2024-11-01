const productService = require("../service/productService");
const ExpressError = require("../utils/expressError");
const { cloudinary } = require("../cloudinary/index"); 



module.exports.getProduct = async (req, res) => {
  const productId =req.body.productId;
  const product = await productService.getProduct(productId);
  res.status(200).json(product);
};


module.exports.productSearch = async (req, res) => {
  const { query, sort, pageNumber } = req.body;
  const searchInfo = { query, sort, pageNumber };
  const response = await productService.search(searchInfo);
  res.status(200).json(response);
};


