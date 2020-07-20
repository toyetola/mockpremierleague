const jwt = require("jsonwebtoken");
// middleware to validate token
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token") || req.header('Authorization')
  if (!token) return res.status(401).json({ error: "Access denied: Token not set" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ error: "Token is not valid. You need to sign in again"});
  }
};
module.exports = verifyToken;