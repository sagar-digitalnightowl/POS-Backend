import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const handleFilesUpload = async(files, moduleName)=>{
    let uploadedFiles = {};

    try {
        if (!files || Object.keys(files).length === 0) {
          console.log("No files were uploaded");
          return uploadedFiles;
        }
          for (const [key, fileArray] of Object.entries(files)) {
            if (fileArray && fileArray.length > 0) {
              const file = fileArray[0]; // Assuming single file upload for each key
              const localFilePath = `./public/temp/${file.filename}`;
            //   const moduleName = "Sale";
    
              const uploadResult = await uploadOnCloudinary(
                localFilePath,
                moduleName,
                `${key}_${Date.now()}`
              );
              if (uploadResult) {
                uploadedFiles[key] = uploadResult.secure_url;
                fs.unlinkSync(localFilePath); // Clean up local file
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
          const localFilePath = `./public/temp/${file.filename}`;
          
  
          // Check if the file exists before proceeding
          if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found at path: ${localFilePath}`);
          }
  
          // Delete old file from Cloudinary if it exists
          if (existingSale && existingSale[key]) {
            const decodedUrl = decodeURIComponent(existingSale[key]);
            const publicId = decodedUrl.replace(/^.*\/(POS_Project\/Sale\/)/, "$1").split(".")[0];
  
            console.log(`Deleting old file from Cloudinary: ${publicId}`);
            const deleteResult = await deleteFromCloudinary(publicId);
  
            if (!deleteResult) {
              throw new Error(`Failed to delete the old file from Cloudinary for ${key}`);
            }
          }
  
          // Upload new file to Cloudinary
          const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);
  
          if (uploadResult) {
            updatedFiles[key] = uploadResult.secure_url;
            fs.unlinkSync(localFilePath); // Clean up the local file
          } else {
            throw new Error(`File upload for ${key} failed`);
          }
        }
      }
    }
  
    return updatedFiles;
  };

export {handleFilesUpload, updateFilesUpload}