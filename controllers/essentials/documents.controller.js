import fs from "fs";
import documentModel from "../../models/essentials/documents.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const routes = {};

routes.addDocument = async (req, res) => {
  try {
    const { description } = req.body;
    let document = null;

    if (!req.file) {
        return res.status(400).json({ error: "Document is required" });
    }

      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "Documents";

      const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);

      if (uploadResult) {
        document = uploadResult.secure_url;
        fs.unlinkSync(localFilePath);
      } else {
        throw new Error("File upload to Cloudinary failed");
      }
    // console.log("Uploaded Files: ", req.file);

    const newDocument = await documentModel.create({ description, document });
    return res
      .status(200)
      .json({ result: newDocument, message: "Document created successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllDocument = async (req, res) => {
  try {
    const allDocument = await documentModel.find();
    if (!allDocument || allDocument === 0) {
      return res.status(400).json({ error: "No document fount" });
    }
    return res.status(200).json({
      result: allDocument,
      message: "All document fetch successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }
    const document = await documentModel.findById(id);
    if (!document) {
      return res.status(404).json({ error: `Invalid document id = ${id}` });
    }
    return res
      .status(200)
      .json({ result: document, message: "Dcoment data fetched successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const existDocument = await documentModel.findById(id);
    if (!existDocument) {
      return res
        .status(404)
        .json({ error: `Document not found with id: ${id}` });
    }

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "document";

      if (existDocument && existDocument.document) {
        const decodedUrl = decodeURIComponent(existDocument.document);
        const publicId = decodedUrl
          .replace(/^.*\/(POS_Project\/document\/)/, "$1")
          .split(".")[0];

        const deleteResult = await deleteFromCloudinary(publicId);

        if (!deleteResult) {
          return res
            .status(500)
            .json({ error: "Failed to delete the old file from Cloudinary" });
        }
      }
      const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);

      if (uploadResult) {
        updateData.document = uploadResult.secure_url; // Store Cloudinary URL
        fs.unlinkSync(localFilePath); // Clean up temporary file after upload
      } else {
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    const newDocument = await documentModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ result: newDocument, message: "Document updated successfully" });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const data = await documentModel.findById(id);

    if(!data){
        return res.status(400).json({error:`Document is not found with id: ${id}`})
    }
    const decodedUrl = decodeURIComponent(data.document);

    const publicId = decodedUrl
    .replace(/^.*\/(POS_Project\/document\/)/, "$1") 
      .split(".")[0];

    const deleteResult = await deleteFromCloudinary(publicId);

    if (!deleteResult) {
        return res.status(500).json({ error: "Failed to delete the file from Cloudinary" });
      }
  
      // Proceed to delete the document from the database
      await documentModel.findByIdAndDelete(id);
  
      res.status(200).json({
        result: data,
        message: "Alert & Modifications deleted successfully",
      });

  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
