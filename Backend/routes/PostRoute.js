//? ==================== IMPORT TECHs & LIBRARIES ====================
const express = require("express");
const verifyToken = require("../middleware/Auth");

//? ==================== IMPORT FUNCTION ====================
const { create_post } = require("../controllers/post/CreatePostController");
const { update_post } = require("../controllers/post/UpdatePostController");
const { delete_post } = require("../controllers/post/DeletePostController");
const { list_post } = require("../controllers/post/GetListPostController");
const {
  get_detail_post,
} = require("../controllers/post/GetDetailPostController");

//? ==================== USING ROUTER FROM EXPRESS ====================
const router = express.Router();

router.post("/create", verifyToken, create_post);
router.put("/update", verifyToken, update_post);
router.delete("/delete", verifyToken, delete_post);
router.get("/list-post", list_post);
router.get("/get-detail-post", verifyToken, get_detail_post);

module.exports = router;
