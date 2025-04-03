import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

// ✅ Upload file to S3
export const uploadFile = async (fileBuffer, fileName, mimeType) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("File uploaded successfully:", fileName);
    return { success: true, Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// ✅ Delete file from S3
export const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log("File deleted successfully:", key);
    return { success: true, message: "File deleted successfully." };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
