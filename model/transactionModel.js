// models/transactionModel.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number, // Store amount in paise
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["completed", "failed", "pending"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    default: "",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
