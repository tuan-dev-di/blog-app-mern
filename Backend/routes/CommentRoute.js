//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const verifyToken = require("../middleware/Auth");

//? ---------------| IMPORT FUNCTION |---------------
const {
  create_comment,
} = require("../controllers/comment/CreateCommentController");
const {
  update_comment,
} = require("../controllers/comment/UpdateCommentController");
const {
  delete_comment,
} = require("../controllers/comment/DeleteCommentController");
const {
  get_comments,
} = require("../controllers/comment/GetListCommentController");

//? ---------------| USING ROUTER FROM EXPRESS |---------------
const router = express.Router();

router.post("/create/:postId/:userId", verifyToken, create_comment);
router.get("/get-comments/:postId", get_comments);
router.put("/update/:commentId/:postId/:userId", verifyToken, update_comment);
router.delete("/delete/:commentId/:userId", verifyToken, delete_comment);

module.exports = router;
