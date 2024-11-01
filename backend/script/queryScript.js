const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");
const productData = require("./productsData");
const authUtils = require("../utils/auth.js");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

connectDB().then(async () => {
  try {
    await Product.deleteMany({});
    console.log("Existing products cleared.");

      const transformedData = await Promise.all(
        productData.productsData.map(async (product) => {
        
          return {
            title: product.title,
            description: product.description,
            price: parseFloat(product.price),
            quantity: parseFloat(product.quantity.replace("$", "")),
            image: {
              url: product.image,
        
            },
          };
        })
      );
  
      // Step 3: Save transformed data to the database
      await Product.insertMany(transformedData);
      console.log("Products saved successfully.");
    } catch (error) {
      console.error("Error saving products:", error);
    } finally {
      mongoose.connection.close();
    }
  });

// connectDB().then(async () => {
//   const user = await User.create({
//     fullName: "Mansour Barakji",
//     email: "barakji.mansour2018@gmail.com",
//     password: await authUtils.hashPassword("mansour123"),
//   });
//   if (!user) {
//    console.log("User Not Created")
//   }
//   console.log("User created successfully.");
// });
