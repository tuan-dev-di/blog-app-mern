const express = require("express");

const { sign_in } = require("../controllers/user/SignInController.js");
const { sign_up } = require("../controllers/user/SignUpController.js");
const { google_auth } = require("../controllers/user/GoogleAuthController..js");

const router = express.Router();

router.post("/google-auth", google_auth);
router.post("/sign-in", sign_in);
router.post("/sign-up", sign_up);

module.exports = router;
