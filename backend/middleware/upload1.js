const multer = require("multer");
const path = require("path");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename with timestamp
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;  // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);  // Accept the file
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, and .pdf formats allowed!"));  // Reject the file
  }
};

// Initialize multer with options
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
