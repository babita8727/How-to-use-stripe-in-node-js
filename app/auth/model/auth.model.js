const mongoose = require("mongoose");
const auth = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [1, 2, 3], // 0 =>ACTIVE, 1 => INACTIVE, 2 => DELETED, 3 => BAN
      default: 1,
    },
    customerId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.AUTH_MODEL = mongoose.model("auth", auth);
