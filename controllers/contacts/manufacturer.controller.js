import { manufacturerValidation } from "../../validations/joi.validations.js";
import manufacturerSchema from "../../models/contacts/manufacturer.model.js";
import { uploadFile, deleteFile } from "../../utils/s3.js";

const routes = {};

routes.addManufacturer = async (req, res) => {
  try {
    const { error } = manufacturerValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email } = req.body;
    const isEmailExists = await manufacturerSchema.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ error: "Email Already Exist" });
    }

    // Handle file uploads
    const files = req.files;
    let profilePhotoUrl = '';
    let letterUrl = '';
    
    console.log("Received files:", files); // Debug log to see what files are received

    // Process profile photo if uploaded
    if (files && files['profilePhoto'] && files['profilePhoto'][0]) {
      const profilePhoto = files['profilePhoto'][0];
      console.log("Processing profile photo:", profilePhoto); // Debug log
      const profilePhotoData = await uploadFile(
        profilePhoto, 
        `manufacturers/${Date.now()}_${profilePhoto.originalname}`
      );
      profilePhotoUrl = profilePhotoData.Location;
      console.log("Profile photo URL:", profilePhotoUrl); // Debug log
    }

    // Process letter if uploaded
    if (files && files['letter'] && files['letter'][0]) {
      const letter = files['letter'][0];
      console.log("Processing letter:", letter); // Debug log
      const letterData = await uploadFile(
        letter,
        `manufacturers/${Date.now()}_${letter.originalname}`
      );
      letterUrl = letterData.Location;
      console.log("Letter URL:", letterUrl); // Debug log
    }

    // Create manufacturer with file URLs
    const newDoc = await manufacturerSchema.create({
      ...req.body,
      ...(profilePhotoUrl && { profilePhotoUrl }), // Only add if exists
      ...(letterUrl && { letterUrl }) // Only add if exists
    });

    return res.status(201).json({ 
      result: newDoc, 
      message: "Manufacturer created successfully" 
    });

  } catch (error) {
    console.log("Error", error.message);
    
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllManufacturer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const allDoc = await manufacturerSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "All Data fetched Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await manufacturerSchema.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not Found" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await manufacturerSchema.findById(id);
    if (!existing) return res.status(404).json({ error: "Manufacturer not found" });

    const updateData = { ...req.body };
    const filesToDelete = [];

    const processFileUpdate = async (fieldName) => {
      if (!req.files?.[fieldName]?.[0]) return;
      
      const file = req.files[fieldName][0];
      const newFileName = `manufacturers/${Date.now()}_${file.originalname}`;
      const uploaded = await uploadFile(file, newFileName);
      updateData[`${fieldName}Url`] = uploaded.Location;
      
      if (existing[`${fieldName}Url`]) {
        // Properly extract the S3 key from the URL
        const url = new URL(existing[`${fieldName}Url`]);
        const oldFileKey = url.pathname.substring(1); // Remove leading slash
        filesToDelete.push(oldFileKey);
        console.log(`Marked for deletion: ${oldFileKey}`);
      }
    };

    await Promise.all([
      processFileUpdate('profilePhoto'),
      processFileUpdate('letter')
    ]);

    const updatedDoc = await manufacturerSchema.findByIdAndUpdate(id, updateData, { new: true });
    
    if (filesToDelete.length > 0) {
      console.log('Files to be deleted:', filesToDelete);
      await Promise.all(
        filesToDelete.map(key => {
          console.log(`Attempting to delete: ${key}`);
          return deleteFile(key)
            .then(() => console.log(`Successfully deleted: ${key}`))
            .catch(e => console.error(`Failed to delete ${key}:`, e.message));
        })
      );
    }

    return res.status(200).json({ 
      result: updatedDoc, 
      message: "Manufacturer updated successfully" 
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Failed to update manufacturer" });
  }
};

routes.deleteManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoc = await manufacturerSchema.findByIdAndDelete(id);
    if (!deletedDoc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res.status(200).json({ message: "Document Delete Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export default routes