import jobSheetSchema from "../../models/repair/jobSheet.model.js"
import { jobSheetValidation } from "../../validations/joi.validations.js";
import { uploadFile, deleteFile  } from "../../utils/s3.js";

const routes = {};

routes.addJobSheet = async (req, res) => {
  try {
    // ✅ Validate request body (excluding the file for now)
    const { error } = jobSheetValidation.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    
    // ✅ Handle file upload
    if (!req.file) {
      return res.status(400).json({ error: "Document file is required." });
    }

    const file = req.file;
    const timestamp = Date.now(); // avoid file name collision
    const fileName = `${timestamp}-${file.originalname}`;

    const uploadResult = await uploadFile(file.buffer, fileName, file.mimetype);

    // ✅ Add the uploaded file URL to req.body before saving
    const newDoc = await jobSheetSchema.create({
      ...req.body,
      document: uploadResult.Location,
    });

    return res
      .status(201)
      .json({ result: newDoc, message: "New Job Sheet created." });
  } catch (error) {
    console.log("Error in addJobSheet:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};


routes.getAllJobSheet = async (req, res) => {
  try {
    const { limit = 10, page = 1} = req.query;
    const allJobSheet = await jobSheetSchema.countDocuments();
    const totalPage = Math.ceil(allJobSheet/limit);
    const allDoc = await jobSheetSchema
      .find()
      .populate({
        path: "customer",
        select: "firstName middleName lastName"
      })
      .populate({
        path: "brand",
        select: "name"
      })
      .populate({
        path: "device",
        select: "deviceName"
      })
      .populate({
        path: "deviceModel",
        select: "deviceModel"
      })
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, totalPage, message: "Document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getJobSheetById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;
    if(!jobSheetId) return res.status(400).json({ error: "Job sheet Id is required" })

    const doc = await jobSheetSchema.findById(jobSheetId);

    console.log(doc, "joc sheet")
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};


routes.updateJobSheetById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;

    // Find existing document
    const existingDoc = await jobSheetSchema.findById(jobSheetId);
    if (!existingDoc) {
      return res.status(404).json({ error: "Document not found with this id" });
    }

    // Handle file update
    if (req.file) {
      // Upload new file to S3
      const file = req.file;
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const uploadResult = await uploadFile(file.buffer, fileName, file.mimetype);

      // Delete old file from S3 if it exists
      if (existingDoc.document) {
        const oldFileUrl = existingDoc.document;
        const oldKey = oldFileUrl.split(".com/")[1]; // Extract key from URL
        await deleteFile(oldKey);
      }

      // Add new file URL to update body
      req.body.document = uploadResult.Location;
    }

    // Update document
    const updatedDoc = await jobSheetSchema.findByIdAndUpdate(
      jobSheetId,
      req.body,
      { new: true }
    );

    return res
      .status(200)
      .json({ result: updatedDoc, message: "Document updated successfully" });
  } catch (error) {
    console.error("Error in updateJobSheetById:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteJobSheetById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;

    // ✅ Find the document first
    const doc = await jobSheetSchema.findById(jobSheetId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found with this ID" });
    }

    // ✅ Delete the file from S3 if it exists
    if (doc.document) {
      const fileKey = doc.document.split(".com/")[1]; // Extract key from full URL
      if (fileKey) {
        await deleteFile(fileKey);
      }
    }

    // ✅ Delete document from MongoDB
    await jobSheetSchema.findByIdAndDelete(jobSheetId);

    return res.status(200).json({
      result: doc,
      message: "Document and associated file deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteJobSheetById:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
