import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

// AWS S3 Configuration
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

// Multer Storage for AWS S3
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE, // Auto-detect file type
    key: function (req, file, cb) {
      const fileName = `manufacturer-files/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});