import { manufacturerValidation } from "../../validations/joi.validations.js";
import manufacturerSchema from "../../models/contacts/manufacturer.model.js";
import { uploadFile, deleteFile } from "../../utils/s3.js";

const routes = {};

routes.addManufacturer = async (req, res) => {
  try {
    // Validate request body
    const { error } = manufacturerValidation.validate(req.body);
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({ 
        error: error.details[0].message,
        details: error.details 
      });
    }

    // Check for email existence
    const { email } = req.body;
    const isEmailExists = await manufacturerSchema.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Process files
    const files = req.body;
    let profilePhotoUrl = '';
    let letterUrl = '';

    if (files?.profilePhoto?.[0]) {
      const profilePhoto = files.profilePhoto[0];
      console.log('Uploading profile photo:', profilePhoto.originalname);
      const profilePhotoData = await uploadFile(
        profilePhoto, 
        `manufacturers/${Date.now()}_${profilePhoto.originalname}`
      );
      profilePhotoUrl = profilePhotoData.Location;
    }

    if (files?.letter?.[0]) {
      const letter = files.letter[0];
      console.log('Uploading letter:', letter.originalname);
      const letterData = await uploadFile(
        letter,
        `manufacturers/${Date.now()}_${letter.originalname}`
      );
      letterUrl = letterData.Location;
    }

    // Create manufacturer
    const newDoc = await manufacturerSchema.create({
      ...req.body,
      ...(profilePhotoUrl && { profilePhotoUrl }),
      ...(letterUrl && { letterUrl })
    });

    return res.status(201).json({ 
      result: newDoc, 
      message: "Manufacturer created successfully" 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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