const express = require('express');
const router = express.Router();
const Transaction = require('../model/transactionModel');
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require('mongoose');

// Get current user's transactions
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({
            $or: [
                { from: userId },
                { to: userId }
            ]
        }).sort({ timestamp: -1 });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("User transactions error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Admin route to get all transactions
router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Check if the user is admin or manager
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).json({ error: "Access denied" });
        }

        const transactions = await Transaction.find().sort({ timestamp: -1 });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("All transactions fetch error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
