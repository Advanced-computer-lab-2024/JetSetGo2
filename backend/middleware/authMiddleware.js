const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Save the user ID to the request object
    req.AccountType = decoded.AccountType; // Save the AccountType if needed
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = authMiddleware;
