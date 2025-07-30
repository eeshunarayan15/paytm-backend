const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');


const zod=require('zod')
const userModel=require('../model/users')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const authMiddleware=require('../middleware/authMiddleware')
const Account = require('../model/accountSchema');
console.log("jwt secret",process.env.JWT_SECRET);

const signupSchema = zod.object({
    username: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string().min(1),
    lastname: zod.string().min(1),
    role: zod.enum(["user", "admin"]).optional(), // Optional role
});

router.post("/signup", async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Validation failed", error: result.error });
        }

        const { username, email, password, firstname, lastname, role } = result.data;

        const userExists = await userModel.findOne({ username });


        if (userExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname,
            role: role || "user", // Default role
        });

        await newUser.save();
        await Account.create({
            userId: newUser._id,
            balance: mongoose.Types.Decimal128.fromString("0.00"),
            updatedAt: new Date()
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User created successfully",
            token,
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
const SigninSchema = zod.object({
    username: zod.string().min(3, "Username must be at least 3 characters"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
});

router.post('/sign', async (req, res) => {
    const result = SigninSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { username, password } = result.data;

    try {
        const existingUser = await userModel.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Username does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password does not match" });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                username: existingUser.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
                issuer: "PayTm",
                subject: existingUser._id.toString(),
                audience: "myapp-users"
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});


const changePasswordSchema = zod.object({
    oldPassword: zod.string().min(6),
    newPassword: zod.string().min(6),
});

router.post("/change-password", authMiddleware, async (req, res) => {

    console.log("REQ BODY:", req.body);

    const result = changePasswordSchema.safeParse(req.body);
    console.log(result,"result")
    if (!result.success) {
        console.log("validation failed", result.error);
        return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { oldPassword, newPassword } = result.data;

    try {
        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(403).json({ message: "Old password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const updateEmailSchema = zod.object({
    newEmail: zod.string().email(),
});

router.post("/change-email", authMiddleware, async (req, res) => {
    const result = updateEmailSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { newEmail } = result.data;

    try {
        const existing = await userModel.findOne({ email: newEmail });
        if (existing) return res.status(409).json({ message: "Email already in use" });

        const user = await userModel.findByIdAndUpdate(req.user._id, { email: newEmail }, { new: true });
        res.json({ message: "Email updated successfully", email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const updateNameSchema = zod.object({
    firstname: zod.string().min(1).optional(),
    lastname: zod.string().min(1).optional(),
});

router.post("/change-name", authMiddleware, async (req, res) => {
    const result = updateNameSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { firstname, lastname } = result.data;

    try {
        const updateFields = {};
        if (firstname) updateFields.firstname = firstname;
        if (lastname) updateFields.lastname = lastname;

        const user = await userModel.findByIdAndUpdate(req.user._id, updateFields, { new: true });
        res.json({ message: "Name updated successfully", user: { firstname: user.firstname, lastname: user.lastname } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await userModel.find({
            $or: [
                { firstname: { $regex: filter, $options: "i" } },
                { lastname: { $regex: filter, $options: "i" } },
                { username: { $regex: filter, $options: "i" } },
            ]
        });

        res.status(200).json({
            users: users.map(user => ({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username
            }))
        });
    } catch (error) {
        console.error("Search error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

const deleteSchema = zod.object({
    username: zod.string().min(3),
    password: zod.string().min(6),
});

router.delete('/delete-account', authMiddleware, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Incorrect password" });
        }

        const account = await Account.findOne({ userId: user._id });

        // Case 1: Account found and has balance
        if (account) {
            const balance = parseFloat(account.balance.toString());
            if (balance > 0) {
                console.log(`Admin should refund ₹${balance} to user ${username}`);
            }

            // Delete account
            await Account.deleteOne({ userId: user._id });
        } else {
            console.log(`No account found for user ${username}. Proceeding with deletion.`);
        }

        // Delete user after handling account
        await userModel.deleteOne({ _id: user._id });

        res.status(200).json({
            message: "Account closed and user deleted successfully",
            balanceMessage: account && parseFloat(account.balance.toString()) > 0
                ? "Please return user balance manually"
                : undefined
        });
    } catch (err) {
        console.error("Deletion error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

const depositSchema = zod.object({
    username: zod.string().min(3),
    amount: zod.number().positive(),
});


module.exports = router;