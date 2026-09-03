// Multer config for restaurant image/media uploads. Files are stored on disk
// under Backend/media and served statically from /media (see app.js).
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const mediaDir = path.join(__dirname, "..", "media");
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const allowedExtensions = /\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i;

const fileFilter = (req, file, cb) => {
  if (allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("Only image (jpg, png, webp, gif) or video (mp4, mov, webm) files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per file
});

module.exports = upload;
