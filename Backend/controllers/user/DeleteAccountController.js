const User = require("../../models/User");

const { responseHelper } = require("../../utilities/ResponseHelper");

const delete_account = async (req, res) => {
  if (req.user.userId !== req.params.userId)
    return responseHelper(
      res,
      403,
      false,
      "You are not allowed to delete this account"
    );

  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);

    if (!deleteUser)
      return responseHelper(res, 404, false, "User does not exist");

    return responseHelper(res, 200, true, "User is deleted successfully");
  } catch (error) {
    console.log("ERROR:", error);
    return responseHelper(
      res,
      400,
      false,
      `${error.message}` || "Internal Server Error"
    );
  }
};

module.exports = { delete_account };
