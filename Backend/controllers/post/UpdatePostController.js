const Post = require("../../models/Post");
const {
  checkRegexTitle,
  checkLengthTitle,
  checkLengthContent,
  // checkRegexContent,
} = require("../../utilities/validPost");

const imagekit = require("../../utilities/imageKit"); // Khởi tạo SDK
const fs = require("fs");

const update_post = async (req, res) => {
  //? ---------------| CHECK ID & ROLE |---------------
  const user_role = req.user.role;
  const user_id = req.user.userId;
  const param_user_id = req.params.userId;
  const post_id = req.params.postId;
  console.log("POST ID:", post_id);

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

  //? ---------------| CHECK IF ANY FIELDS HAS BEEN CHANGED FROM USER, ONLY DATA ON THAT FIELD WILL BE UPDATED |---------------
  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (category) updateData.category = category;

  //? ---------------| COMPARE OLD AND NEW IMAGE |---------------
  //? ---------------| ADD NEW IMAGE AND DELETE OLD IMAGE ON IMAGEKIT |---------------
  const currentPost = await Post.findById(post_id); // Get all info of post by Id
  const oldImage = currentPost?.image; // Get current image of post
  if (image) {
    // Check if user changes new image
    if (image !== oldImage && oldImage) {
      // Compare old and new image
      try {
        // Get filename of old image
        // Ex: https://ik.imagekit.io/v1/folder/filename.jpg
        // => filename: avatar.jpg
        const filename = new URL(oldImage).pathname.split("/").pop();

        // Get name of old image by param filename
        const result = await imagekit.listFiles({
          searchQuery: `name=${filename}`,
        });

        // Check result, and get imageId to use function deleteFile
        if (result.length !== 0 || result.length > 0) {
          const fileId = result[0].fileId;
          await imagekit.deleteFile(fileId);
        }
      } catch (error) {
        console.warn("ERORR:", error.message);
      }
    }
    updateData.image = image;
  }

  // if (image) updateData.image = image;

  //? ---------------| CREATE A NEW SLUG WITH TITLE |---------------
  const newSlug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^A-Za-z0-9-]/g, "-");
  updateData.slug = newSlug;

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
