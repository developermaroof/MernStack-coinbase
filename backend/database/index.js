const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../config/index");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
