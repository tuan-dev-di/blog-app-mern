const express = require("express");
const verifyToken = require("../middleware/Auth.js");

const { sign_in } = require("../controllers/user/SignInController.js");
const { sign_up } = require("../controllers/user/SignUpController.js");
const { google_auth } = require("../controllers/user/GoogleAuthController..js");
const {
  update_profile,
} = require("../controllers/user/UpdateProfileController.js");
const {
  delete_profile,
} = require("../controllers/user/DeleteProfileController.js");

const router = express.Router();

// Authentication & Authorization
router.post("/google-auth", google_auth);
router.post("/sign-in", sign_in);
router.post("/sign-up", sign_up);

// Profile
router.put("/profile/update/:userId", verifyToken, update_profile);
router.delete("/profile/delete:userId", verifyToken, delete_profile);

module.exports = router;
