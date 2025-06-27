const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. Invalid Token Format." });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user; // Attach user payload to request object
      console.log(decoded);
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  }
};

module.exports = { authenticateUser };
