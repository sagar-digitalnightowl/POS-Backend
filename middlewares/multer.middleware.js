import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for S3 upload
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    if (file.fieldname === 'profilePhoto') {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed for profile photo'), false);
      }
    }
    if (file.fieldname === 'letter') {
      if (!file.mimetype.match(/^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
        return cb(new Error('Only PDF or Word documents are allowed for letters'), false);
      }
    }
    cb(null, true);
  }
});