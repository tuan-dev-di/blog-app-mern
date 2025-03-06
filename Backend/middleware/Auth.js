const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  //? ---------------| CHECK HAS TAKEN TOKEN |---------------
  const token =
    req.cookies.accessToken || req.header("Authorization").split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Access Denied" });

  //? ---------------| CHECK TOKEN |---------------
  try {
    jwt.verify(token, process.env.Access_Token, (err, user) => {
      if (err)
        return res
          .status(401)
          .json({ success: false, message: "Access Denied" });

      req.user = {
        userId: user.userId,
        role: user.role,
      };
      next();
    });
  } catch (error) {
    console.log("Middleware - ERROR:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;
