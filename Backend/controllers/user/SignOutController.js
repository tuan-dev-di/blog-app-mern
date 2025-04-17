const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const sign_out = async (req, res) => {
  //? ---------------| CHECK TOKEN |---------------
  const token = req.cookies.accessToken;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "No token available. Please sign in",
    });

  try {
    //? ---------------| DECODE TOKEN BY JWT |---------------
    const decodedToken = jwt.decode(token, process.env.Access_Token);
    const id = decodedToken.userId;

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "Sign out successfully!" });
  } catch (error) {
    console.log("Sign out error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { sign_out };
