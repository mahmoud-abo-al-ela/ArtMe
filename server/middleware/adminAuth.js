const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user from token
    req.user = decoded.user;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Token structure invalid" });
    }

    // Check if user exists and has admin role
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Access denied. Admin privileges required" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
