import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import path from 'path'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath, moduleName)=>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary

        const originalFileName = path.basename(localFilePath, path.extname(localFilePath));
        const uniqueSuffix = Date.now();

        const folderName = `POS_Project/${moduleName}`;
        const publicId = `${originalFileName}_${uniqueSuffix}`;

        const response = await cloudinary.uploader.upload
        (localFilePath,{
            folder: folderName,
            public_id: publicId,
            resource_type:"auto"
        })
        //file has been uploaded succesfully
        // console.log("file is uploaded on cloudinary",response.url);
        // fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        
        console.error("Cloudinary upload error:", error);

        // Always clean up temporary files
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Full result:", result);
      return result.result === 'ok'; // If the result is 'ok', the file was deleted
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return false;
    }
  };

export {uploadOnCloudinary, deleteFromCloudinary}