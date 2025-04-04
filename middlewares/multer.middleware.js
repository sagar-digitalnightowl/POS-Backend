import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 2, // Maximum 2 files
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profilePhoto" && !file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
      return cb(new Error("Only JPEG, JPG, PNG files are allowed for profile photo"), false);
    }
    if (file.fieldname === "letter" && !file.mimetype.match(/^application\/pdf$/)) {
      return cb(new Error("Only PDF files are allowed for letters"), false);
    }
    cb(null, true);
  },
});

