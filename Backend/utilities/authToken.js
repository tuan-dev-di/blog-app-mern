const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.Access_Token,
    { expiresIn: "24h" }
  );

  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.Refresh_Token,
    { expiresIn: "3d" }
  );

  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
