//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const verifyToken = require("../middleware/Auth.js");

//? ---------------| IMPORT FUNCTION |---------------
const { sign_in } = require("../controllers/user/SignInController.js");
const { sign_up } = require("../controllers/user/SignUpController.js");
const { sign_out } = require("../controllers/user/SignOutController.js");
const { google_auth } = require("../controllers/user/GoogleAuthController..js");
const {
  update_account,
} = require("../controllers/user/UpdateAccountController.js");
const {
  delete_account,
} = require("../controllers/user/DeleteAccountController.js");
const { get_users } = require("../controllers/user/GetListUserController.js");
// const { get_user } = require("../controllers/user/GetUserController.js");

//? ---------------| USING ROUTER FROM EXPRESS |---------------
const router = express.Router();

// Authentication & Authorization
router.post("/google-auth", google_auth);
router.post("/sign-in", sign_in);
router.post("/sign-up", sign_up);
router.post("/sign-out/:userId", sign_out);

// Account
router.put("/account/update/:userId", verifyToken, update_account);
router.delete("/account/delete/:userId", verifyToken, delete_account);
router.post("/get-users/:userId", verifyToken, get_users);
// router.get("/:userId", get_user);

module.exports = router;
