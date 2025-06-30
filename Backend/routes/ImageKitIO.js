//? ---------------| IMPORT TECHs & LIBRARIES |---------------
const express = require("express");
const imageKit = require("../utilities/imageKit");
const upload = require("../utilities/multer");

//? ---------------| USING ROUTER FROM EXPRESS |---------------
const router = express.Router();

router.get("/imagekit-auth", (req, res) => {
  const authParams = imageKit.getAuthenticationParameters();
  console.log("AUTH PARAMS:", authParams);

  res.json(authParams);
});

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("REQ FILE:", req.file); // 

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Không nhận được file từ phía người dùng",
    });
  }

  try {
    const file = req.file;
    const response = await imageKit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/blog-app-mern",
    });

    return res.status(200).json({
      success: true,
      message: "Upload Image Successfully",
      url: response.url,
    });
  } catch (error) {
    console.log("ERROR UPLOAD FILE:", error.message);
    return res.status(500).json({
      success: false,
      message: `${error.message}` || "Internal Server Error",
    });
  }
});

module.exports = router;
