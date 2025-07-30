const express = require('express');
const router = express.Router();
const Transaction = require('../model/transactionModel');
const authMiddleware = require("../middleware/authMiddleware");

// Admin role check middleware
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

// ✅ 1. Get all transactions for the logged-in user
router.get('/my-transactions', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { from: req.user._id },
                { to: req.user._id }
            ]
        }).sort({ timestamp: -1 }).populate('from to', 'username email');

        res.status(200).json(transactions);
    } catch (err) {
        console.error("User transactions error:", err.message);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
});

// ✅ 2. Admin: Get all transactions in system
router.get('/admin/transactions', authMiddleware, isAdmin, async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ timestamp: -1 })
            .populate('from to', 'username email');

        res.status(200).json(transactions);
    } catch (err) {
        console.error("Admin transactions error:", err.message);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
});

module.exports = router;
