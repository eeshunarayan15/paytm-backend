const jwt = require('jsonwebtoken');
const userModel = require('../model/users');

const authMiddleware= async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        console.log(user,"user at middleware")


        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          
        }

        req.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role, // Add role here
        };

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Token verification failed" });
    }
};

module.exports = authMiddleware;
