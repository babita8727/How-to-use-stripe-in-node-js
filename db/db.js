const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

try {
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Mongodb connected successfully");
  });
} catch (error) {
  console.log("error", error);
}
