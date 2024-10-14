const jwt = require("jsonwebtoken");

const JWT_SECRET = "123@abc$in"; // Should be the same as in your login route

// Middleware to verify the JWT token
function authMiddleware(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = authMiddleware;
