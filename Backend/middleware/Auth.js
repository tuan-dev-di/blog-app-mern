const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  //? ---------------| CHECK HAS TAKEN TOKEN |---------------
  const token =
    req.body.accessToken ||
    req.cookies.accessToken ||
    (req.header("Authorization") && req.header("Authorization").split(" ")[1]);
  // req.cookies.accessToken;
  console.log("TOKEN:", token);
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied" });

  //? ---------------| CHECK TOKEN |---------------
  try {
    jwt.verify(token, process.env.Access_Token, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError")
          // Check token expire
          return res
            .status(401)
            .json({ success: false, message: "Token expired" });

        if (err.name === "JsonWebTokenError")
          // Check token valid
          return res
            .status(401)
            .json({ success: false, message: "Invalid token" });

        // Remove cookie token if token error to avoid using older token
        res.clearCookie("accessToken");

        return res
          .status(401)
          .json({ success: false, message: "Access denied" });
      }

      req.user = {
        userId: user.userId,
        role: user.role,
      };
      next();
    });
  } catch (error) {
    console.log("Middleware error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;
