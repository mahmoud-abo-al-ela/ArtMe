const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check both Authorization header and x-auth-token header
  const bearerToken = req.header("Authorization")?.replace("Bearer ", "");
  const xAuthToken = req.header("x-auth-token");
  const token = bearerToken || xAuthToken;

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
      code: "NO_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add token expiration check with time buffer (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;

    // Add expiration warning if token will expire soon (less than 1 hour)
    if (timeUntilExpiry < 3600) {
      res.set("X-Token-Expiring-Soon", "true");
      res.set("X-Token-Expires-In", timeUntilExpiry.toString());
    }

    // Normalize user object structure for consistent access
    if (decoded.user && decoded.user.id) {
      // If user is nested in decoded object
      req.user = decoded.user;
    } else if (decoded.id) {
      // If id is directly on decoded object
      req.user = { id: decoded.id };
    } else {
      // Default to original structure
      req.user = decoded;
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token. Please log in again.",
        code: "INVALID_TOKEN",
      });
    } else {
      return res.status(401).json({
        message: "Token is not valid",
        code: "AUTH_ERROR",
      });
    }
  }
};
