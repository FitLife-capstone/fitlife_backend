const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized: Token is missing" });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_USER);
      req.user = {
        userId: decoded.userId,
        role: "user",
      };
    } catch (userError) {
      decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_ADMIN);
      req.user = {
        userId: decoded.userId,
        role: "admin",
      };
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(401)
      .json({ error: true, message: "Unauthorized: Invalid token" });
  }
};

module.exports = { authMiddleware };
