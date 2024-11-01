const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const { errorHandler, routeNotFound } = require("./middleware/error");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const cookieParser = require("cookie-parser");
const ExpressError = require("./utils/expressError.js");
const { isAuthenticated } = require("./middleware/auth.js");
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      throw new ExpressError(
        `This request contains sanitized field: ${key}`,
        400
      );
    },
  })
);

app.use(helmet());

app.use(isAuthenticated)

app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/product" ,require("./routes/product"));
app.use("/api/v1/order", require("./routes/order"));

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

