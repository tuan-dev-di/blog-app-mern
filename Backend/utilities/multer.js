const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const validType = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (validType.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ cho phép JPEG, JPG, PNG, WEBP hoặc GIF"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // Max 2MB for Image
  },
});

module.exports = upload;
