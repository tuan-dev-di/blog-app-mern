//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const verifyToken = require("../middleware/Auth");

//? ---------------| IMPORT FUNCTION |---------------
const { create_post } = require("../controllers/post/CreatePostController");
const { update_post } = require("../controllers/post/UpdatePostController");
const { delete_post } = require("../controllers/post/DeletePostController");
const { get_posts } = require("../controllers/post/GetListPostController");

//? ---------------| USING ROUTER FROM EXPRESS |---------------
const router = express.Router();

router.post("/create/:userId", verifyToken, create_post);
router.get("/get-posts/", get_posts);
router.put("/update/:postId/:userId", verifyToken, update_post);
router.delete("/delete/:postId/:userId", verifyToken, delete_post);

module.exports = router;
