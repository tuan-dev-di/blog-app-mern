const responseHelper = (
  res,
  statusCode,
  success,
  message,
  cookies = [],
  data = {}
) => {
  if (!Array.isArray(cookies)) cookies = []; // Gán giá trị mặc định nếu không phải mảng

  // Create a loop to check array of cookies
  cookies.forEach((cookie) => {
    // Create variables to logout with name 'cookie'
    const { name, value, options } = cookie;
    // return variables with name cookie in array of cookies
    res.cookie(name, value, options);
  });

  return res.status(statusCode).json({
    success: success,
    message: message,
    ...data,
  });
};

module.exports = { responseHelper };
