const express = require("express");
const connectDB = require("./database");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(router);

connectDB();

app.use(errorHandler);

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
