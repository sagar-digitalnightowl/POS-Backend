import path from "path";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const handleFilesUpload = async (files, moduleName) => {
  let uploadedFiles = {};

  try {
    if (!files || Object.keys(files).length === 0) {
      console.log("No files were uploaded");
      return uploadedFiles;
    }

    for (const [key, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0]; // Assuming single file upload for each key

        const tempDir = path.join(process.cwd(), "public", "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const filename = `${key}_${Date.now()}${path.extname(file.originalname)}`;
        const localFilePath = path.join(process.cwd(), "public", "temp", filename);
        //   const moduleName = "Sale";

        fs.writeFileSync(localFilePath, file.buffer);

        const uploadResult = await uploadOnCloudinary(
          localFilePath,
          moduleName,
          `${key}_${Date.now()}`
        );
        
        fs.unlinkSync(localFilePath); // Clean up local file

        if (uploadResult) {
          uploadedFiles[key] = uploadResult.secure_url;
        } else {
          throw new Error(`File upload for ${key} failed`);
        }
      } else {
        console.error(`No files found for key: ${key}`);
      }
    }
  } catch (error) {
    console.error("File upload error:", error);
  }

  return uploadedFiles;
}

const updateFilesUpload = async (files, existingSale, moduleName) => {
  let updatedFiles = {};

  if (files) {
    const fileKeys = Object.keys(files); // Get file keys (attachDocument, shippingDocuments)

    for (const key of fileKeys) {
      const fileArray = files[key];

      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0]; // Assuming single file upload for each key

        const tempDir = path.join(process.cwd(), "public", "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const filename = `${key}_${Date.now()}${path.extname(file.originalname)}`;
        const localFilePath = path.join(tempDir, filename);
        fs.writeFileSync(localFilePath, file.buffer);

        // const localFilePath = `./public/temp/${file.filename}`;


        // Check if the file exists before proceeding
        if (!fs.existsSync(localFilePath)) {
          throw new Error(`File not found at path: ${localFilePath}`);
        }


        
        // Delete old Cloudinary file if exists
        if (existingSale && existingSale[key]) {
          const decodedUrl = decodeURIComponent(existingSale[key]);
          const match = decodedUrl.match(/upload\/v\d+\/(.+)\.[a-zA-Z]+$/);
          const publicId = match ? match[1] : null;

          if (publicId) {
            console.log(`Deleting old file from Cloudinary: ${publicId}`);
            const deleteResult = await deleteFromCloudinary(publicId);
            if (!deleteResult) {
              // throw new Error(`Failed to delete the old file from Cloudinary for ${key}`);
              console.error(`Failed to delete the old file from Cloudinary for ${key}`);
            }
          } else {
            console.warn(`Could not extract publicId for ${key}`);
          }
        }


        // Delete old file from Cloudinary if it exists
        // if (existingSale && existingSale[key]) {
        //   const decodedUrl = decodeURIComponent(existingSale[key]);
        //   const publicId = decodedUrl.replace(/^.*\/(POS_Project\/Sale\/)/, "$1").split(".")[0];

        //   console.log(`Deleting old file from Cloudinary: ${publicId}`);
        //   const deleteResult = await deleteFromCloudinary(publicId);

        //   if (!deleteResult) {
        //     throw new Error(`Failed to delete the old file from Cloudinary for ${key}`);
        //   }
        // }

        // Upload new file to Cloudinary
        const uploadResult = await uploadOnCloudinary(localFilePath, moduleName, filename);
        fs.unlinkSync(localFilePath); // Clean up the local file

        if (uploadResult) {
          updatedFiles[key] = uploadResult.secure_url;
        } else {
          throw new Error(`File upload for ${key} failed`);
        }
      }
    }
  }

  return updatedFiles;
};



const deleteFileFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) throw new Error('No file URL provided');

    // Decode and extract publicId from Cloudinary URL
    const decodedUrl = decodeURIComponent(fileUrl);
    const match = decodedUrl.match(/upload\/v\d+\/(.+)\.[a-zA-Z]+$/);
    const publicId = match ? match[1] : null;

    if (!publicId) {
      throw new Error('Invalid Cloudinary URL - could not extract publicId');
    }

    console.log(`Deleting file from Cloudinary: ${publicId}`);
    const result = await deleteFromCloudinary(publicId);

    return !!result;
  } catch (error) {
    console.error(`Error deleting Cloudinary file: ${error.message}`);
    return false;
  }
};



export { handleFilesUpload, updateFilesUpload, deleteFileFromCloudinary }