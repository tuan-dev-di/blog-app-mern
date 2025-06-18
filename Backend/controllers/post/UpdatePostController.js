const Post = require("../../models/Post");
const {
  checkRegexTitle,
  checkLengthTitle,
  checkLengthContent,
  // checkRegexContent,
} = require("../../utilities/validPost");

const update_post = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  const user_role = req.user.role;

  if (user_role !== "admin" || user_id !== param_user_id)
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });

  const { title, category, content, image } = req.body;

  //? ---------------| CHECK TITLE |---------------
  const titleExisted = await Post.findOne({ title });
  if (titleExisted)
    return res.status(400).json({
      success: false,
      message: "This title has been used, please try again!",
    });

  if (title) {
    if (!checkRegexTitle(title))
      return res.status(400).json({
        success: false,
        message: "Title is not matched with Regex Pattern ",
      });

    if (checkLengthTitle(title))
      return res.status(400).json({
        success: false,
        message: "Length of title must between 10 and 50 characters",
      });
  }

  //? ---------------| CHECK CONTENT |---------------
  if (content) {
    if (checkLengthContent(content))
      return res.status(400).json({
        success: false,
        message: "Length of content must between 50 and 5000 characters",
      });
  }

  //? ---------------| CREATE A NEW SLUG WITH TITLE |---------------
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^A-Za-z0-9-]/g, "-");
  updateData.slug = slug;

  //? ---------------| CHECK IF ANY FIELDS HAS BEEN CHANGED FROM USER, ONLY DATA ON THAT FIELD WILL BE UPDATED |---------------
  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (category) updateData.category = category;
  if (image) updateData.image = image;

  try {
    const updatePost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateData },
      { new: true }
    );

    //? ---------------| CHECK IF THE POST IS NOT FOUND |---------------
    if (!updatePost)
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    const { ...post } = updatePost._doc;

    return res.status(200).json({
      success: true,
      message: "Update post successfully!",
      post: post,
    });
  } catch (error) {
    console.log("Update post error:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
};

module.exports = { update_post };
