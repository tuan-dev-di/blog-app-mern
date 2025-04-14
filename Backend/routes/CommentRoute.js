//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const verifyToken = require("../middleware/Auth");

//? ---------------| IMPORT FUNCTION |---------------
// Comment functions
const {
  create_comment,
} = require("../controllers/comment/CreateCommentController");
const {
  get_comments,
} = require("../controllers/comment/GetListCommentController");
const {
  update_comment,
} = require("../controllers/comment/UpdateCommentController");
const {
  delete_comment,
} = require("../controllers/comment/DeleteCommentController");

//Like comment functions
const {
  like_comment,
} = require("../controllers/comment/LikeCommentController");

//? ---------------| USING ROUTER FROM EXPRESS |---------------
const router = express.Router();

// Comment
router.post("/create/:postId/:userId", verifyToken, create_comment);
router.get("/get-comments/:postId", get_comments);
router.put("/update/:commentId/:userId", verifyToken, update_comment);
router.delete("/delete/:commentId/:userId", verifyToken, delete_comment);

// Like Comment
router.put("/like-comment/:commentId/:userId", verifyToken, like_comment);

module.exports = router;
