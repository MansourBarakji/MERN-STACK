const Product = require("../models/product");
const ExpressError = require("../utils/expressError");



/**
 *
 * @param {String} userId
 * @param {Integer} pageNumber
 * @returns {Array}
 */
const getProduct = async (productId) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw new ExpressError("Product not found", 404);
  }

  return product;
};

/**
 *
 * @param {Object} searchInfo
 * @param {String} searchInfo.query
 * @param {String} searchInfo.sort
 * @param {Number} searchInfo.pageNumber
 * @returns {Object} response
 */

const search = async (searchInfo) => {
  const { query, sort, pageNumber } = searchInfo;
  const page = parseInt(pageNumber) || 1;
  const pageSize = 100;
  let results = [];
  let count = 0;
  let totalPages = 1;

  const searchCriteria = {
    quantity: { $gt: 0 },
  };

  if (query) {
    searchCriteria.$or = [
      { title: { $regex: query, $options: "i" } },  
      { description: { $regex: query, $options: "i" } }, 
    ];
  }

  // Sort options
  let sortObject = {};
  if (sort === "asc") {
    sortObject = { price: 1, _id: -1 };  
  } else if (sort === "desc") {
    sortObject = { price: -1, _id: -1 };  
  } else {
    sortObject = { _id: -1 }; 
  }

  // Fetch results
  const [r, c] = await Promise.all([
    Product.find(searchCriteria)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(sortObject),
    Product.countDocuments(searchCriteria), 
  ]);

  results = r;
  count = c;
  totalPages = Math.ceil(count / pageSize);

  const response = {
    product: results,
    pagination: {
      totalProducts: count,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
    },
  };
  return response;
};

const productService = {
  search,
  getProduct,
};

module.exports = productService;
