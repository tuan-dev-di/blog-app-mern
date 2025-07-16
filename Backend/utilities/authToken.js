const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.Access_Token,
    { expiresIn: "12h" }
  );

  return accessToken;
};

module.exports = {
  generateAccessToken,
};
