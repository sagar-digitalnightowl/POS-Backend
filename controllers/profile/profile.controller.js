import profileModel from "../../models/profile/profile.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import fs from "fs";

const routes = {};

routes.addProfile = async (req, res) => {
  try {
    const  data  = req.body;
    if (
      !data.prefix ||
      !data.firstName ||
      !data.email ||
      !data.dateOfBirth ||
      !data.mobileNumber ||
      !data.idProofName ||
      !data.idProofNumber
    ) {
      return res.status(400).json({
        error:
          "Prefix, FirstName, Email, DOB, Mobile No., ID Name and ID No. Are required",
      });
    }

    const existingProfile = await profileModel.findOne({ email: data.email });
    if (existingProfile) {
      return res.status(400).json({ error: "Email already exists" });
    }

    let uploadImage = null;
    if (!req.file) {
      return res.status(400).json({ error: "Document is required" });
    }

    const file = req.file;
    const localFilePath = `./public/temp/${file.filename}`;
    const moduleName = "Profile";

    const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);
    if (uploadResult) {
      uploadImage = uploadResult.secure_url;
      fs.unlinkSync(localFilePath);
    } else {
      throw new Error("File upload to cloudinary falied");
    }

    const newProfile = await profileModel.create({
      ...data,
      uploadImage,
    });

    return res
      .status(200)
      .json({ result: newProfile, message: "Profile created successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllProfile = async (req, res) => {
  try {
    const allProfile = await profileModel.find();
    if (!allProfile || allProfile === 0) {
      return res.status(400).json({ error: "No profile data found" });
    }
    return res.status(200).json({
      result: allProfile,
      message: "All profile retrived successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }
    const profile = await profileModel.findById(id);
    if (!profile) {
      return res
        .status(404)
        .json({ error: `No profile is found with Id: ${id}` });
    }
    return res
      .status(200)
      .json({ result: profile, message: "Profile data fetched successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    if (
      !updateData.prefix ||
      !updateData.firstName ||
      !updateData.email ||
      !updateData.dateOfBirth ||
      !updateData.mobileNumber ||
      !updateData.idProofName ||
      !updateData.idProofNumber
    ) {
      return res.status(400).json({
        error:
          "Prefix, FirstName, Email, DOB, Mobile No., ID Name and ID No. Are required",
      });
    }

    const existProfile = await profileModel.findById(id);
    if (!existProfile) {
      return res
        .status(404)
        .json({ error: `No profile is found with Id: ${id}` });
    }

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "Profile";

      if (existProfile && existProfile.uploadImage) {
        const decodedUrl = decodeURIComponent(existProfile.uploadImage);
        const publicId = decodedUrl
          .replace(/^.*\/(POS_Project\/Profile\/)/, "$1")
          .split(".")[0];


        const deleteResult = await deleteFromCloudinary(publicId);

        if (!deleteResult) {
          return res
            .status(500)
            .json({ error: "Failed to delete the old file from Cloudinary" });
        }
        const uploadResult = await uploadOnCloudinary(
          localFilePath,
          moduleName
        );

        if (uploadResult) {
          updateData.uploadImage = uploadResult.secure_url;
          fs.unlinkSync(localFilePath);
        } else {
          return res.status(500).json({ error: "File upload failed" });
        }
      }
    }

    const newProfile = await profileModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ result: newProfile, message: "Profile updated successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteProfileById = async(req,res)=>{
    try {
        const { id } = req.params;
        if (!id) {
          return res.status(400).json({ error: "Id is required" });
        }

        const profile = await profileModel.findById(id)
        if(!profile){
            return res.staus(404).json({error:`No profile is found with Id: ${id}`})
        }

        const decodeUrl = decodeURIComponent(profile.uploadImage);
    const publicId = decodeUrl
      .replace(/^.*\/(POS_Project\/Profile\/)/, "$1")
      .split(".")[0];

        console.log("uploadImage = ",profile.uploadImage)
        console.log("public ID = ",publicId)

        const deleteResult = await deleteFromCloudinary(publicId)
        if(!deleteResult){
            return res.status(400).json({error:"Failed to delete file from cloudinary"})
        }

        await profileModel.findByIdAndDelete(id);

        res.status(200).json({
            result: profile,
            message: "To do deleted successfully"
        })
    } catch (error) {
        console.log("error=", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default routes;
