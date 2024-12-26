const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token)
//     return res.status(401).json({ success: false, message: "Access Denied" });

//   try {
//     const decodedToken = jwt.verify(token, process.env.Access_Token);
//     req.userId = decodedToken.userId;
//     next();
//   } catch (error) {
//     console.log("ERROR: ", error);
//     return res.status(403).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res.status(401).json({ success: false, message: "Access Denied" });

  try {
    jwt.verify(token, process.env.Access_Token, (err, user) => {
      if (err)
        return res
          .status(401)
          .json({ success: false, message: "Access Denied" });
      req.user = user;
      next();
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;
