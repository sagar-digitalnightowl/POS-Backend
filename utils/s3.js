  import AWS from "aws-sdk"
  import {config} from "dotenv"
  config()


  export const getSignedUrl = async (key) => {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }); 
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60,
    };
    const url = await s3.getSignedUrlPromise("getObject", params);
    console.log(url, "url");
    return url;
  };

  export const uploadFile = async (file, fileName) => {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Removed ACL: "public-read" as it's not needed with proper bucket policies
    };
    
    const data = await s3.upload(params).promise();
    return data;
  };

  export const deleteFile = async (key) => {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      logger: console
    });
  
    // Ensure the key is properly decoded
    const decodedKey = decodeURIComponent(key);
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodedKey,
    };
  
    console.log('Full deletion params:', params);
    
    try {
      // First try normal deletion
      const data = await s3.deleteObject(params).promise();
      
      // Verify deletion was successful
      try {
        await s3.headObject(params).promise();
        console.error('File still exists after deletion:', decodedKey);
      } catch (headErr) {
        if (headErr.code === 'NotFound') {
          console.log('Verified deletion successful:', decodedKey);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Complete deletion failed:', {
        key: decodedKey,
        error: error.message,
        code: error.code
      });
      throw error;
    }
  };

  export const getFiles = async () => {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
    };
    const data = await s3.listObjects(params).promise();
    return data;
  };
