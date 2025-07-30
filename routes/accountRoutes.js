// routes/accountRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Account = require("../model/accountSchema");
const User = require("../model/users");
const Transaction = require("../model/transactionModel");
const mongoose = require("mongoose");

const rupeesToPaise = (amt) => Math.round(amt * 100);
const paiseToRupees = (amt) => (amt / 100).toFixed(2);

// Get current user balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.status(200).json({
      balance: paiseToRupees(account.balance),
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Corrected Transfer Route using toUsername
router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { toUsername, amount } = req.body;
    if (!toUsername || !amount) throw new Error("Missing fields");

    const from = req.user._id;
    const paiseAmount = rupeesToPaise(amount);

    const recipientUser = await User.findOne({ username: toUsername });
    if (!recipientUser) throw new Error("Recipient user not found");

    const to = recipientUser._id;

    if (from.toString() === to.toString())
      throw new Error("Cannot transfer to yourself");

    const fromAccount = await Account.findOne({ userId: from });
    if (!fromAccount || fromAccount.balance < paiseAmount)
      throw new Error("Insufficient balance");

    const toAccount = await Account.findOne({ userId: to });
    if (!toAccount) throw new Error("Recipient account not found");

    fromAccount.balance -= paiseAmount;
    toAccount.balance += paiseAmount;

    await fromAccount.save();
    await toAccount.save();

    const transaction = new Transaction({
      from,
      to,
      amount: paiseAmount,
      status: "completed",
    });

    await transaction.save();

    res.status(200).json({
      message: "Transfer successful",
      newBalance: paiseToRupees(fromAccount.balance),
      transactionId: transaction._id,
    });
  } catch (err) {
    console.error("Transfer error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Deposit by admin
router.post("/deposit", authMiddleware, async (req, res) => {
  const { username, amount } = req.body;
  const paiseAmount = rupeesToPaise(amount);

  if (paiseAmount <= 0)
    return res.status(400).json({ message: "Invalid amount" });

  try {
    const admin = await User.findById(req.user._id);
    if (!admin || (admin.role !== "admin" && admin.role !== "manager")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const account = await Account.findOne({ userId: user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += paiseAmount;
    await account.save();

    res.status(200).json({
      message: `₹${amount.toFixed(2)} deposited successfully`,
      newBalance: paiseToRupees(account.balance),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const account = await Account.findOne({ userId: user._id });

    res.status(200).json({
      user,
      wallet: {
        balance: paiseToRupees(account.balance),
        updatedAt: account.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (for admin to view list and transfer)
router.get("/all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
