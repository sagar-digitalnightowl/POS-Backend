import complaintHandlingModel from "../../models/nhra/complaintHandling.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import productModel from "../../models/products/productList.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import { deleteFileFromCloudinary, handleFilesUpload, updateFilesUpload } from "../../cloudService/fileService.js";

const routes = {};

routes.addComplaintHandling = async (req, res) => {
  try {
    const { authorizedRepresentative, medicalDevice } = req.body;

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existMedicalDevice = await productModel.findById(medicalDevice);
    if (!existMedicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const uploadedFiles = await handleFilesUpload(req.files, "Complaint");

    const newComplaintHandling = new complaintHandlingModel({
      ...req.body,
      supportiveDocuments: uploadedFiles.supportiveDocuments,
    });

    await newComplaintHandling.save();

    res.status(201).json({
      result: newComplaintHandling,
      message: "Complaint Handling added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllComplaintHandling = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await complaintHandlingModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allComplainHandling = await complaintHandlingModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("medicalDevice", "productName productModel");

    if (!allComplainHandling) {
      return res.status(400).json({ error: "No Complain found" });
    }

    res.status(200).json({
      result: allComplainHandling,
      totalPage,
      message: "Complain Data retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getComplaintHandlingById = async (req, res) => {
  try {
    const complaintHandlingId = req.params.id;

    if (!complaintHandlingId) {
      res.status(400).json({ error: "Complaint Handling Id is required" });
    }
    const complaintHandling = await complaintHandlingModel.findById(
      complaintHandlingId
    );

    if (!complaintHandling) {
      res.status(400).json({
        error: `Complaint Handling is not found with ID ${complaintHandlingId}`,
      });
    }
    res.status(200).json({
      result: complaintHandling,
      message: "Complaint Handling retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateHandlingById = async (req, res) => {
  try {
    const complaintHandlingId = req.params.id;
    const updateData = req.body;

    const { authorizedRepresentative, medicalDevice } = updateData;

    if (!complaintHandlingId) {
      res.status(400).json({ error: "Complaint Handling Id is required" });
    }

    const existComplaint = await complaintHandlingModel.findById(
      complaintHandlingId
    );

    if (!existComplaint) {
      return res.status(400).json({
        error: `Complain is not found with Id ${complaintHandlingId}`,
      });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existMedicalDevice = await productModel.findById(medicalDevice);
    if (!existMedicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existComplaint,
          "Complaint"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const complaintHandling = await complaintHandlingModel.findByIdAndUpdate(
      complaintHandlingId,
      updateData,
      { new: true }
    );

    if (!complaintHandling) {
      res.status(400).json({
        error: `Complain is not found with Id ${complaintHandlingId}`,
      });
    }
    res.status(200).json({
      result: complaintHandling,
      message: "Complain updated successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteHandlingById = async (req, res) => {
  try {
    const complaintHandlingId = req.params.id;

    if (!complaintHandlingId) {
      res.status(400).json({ error: "Complaint Handling Id is required" });
    }
    const complaintHandling = await complaintHandlingModel.findByIdAndDelete(
      complaintHandlingId
    );
    if (!complaintHandling) {
      return res.status(400).json({
        error: `Complaint Handling is not found with Id ${complaintHandlingId}`,
      });
    }

    await deleteFileFromCloudinary(complaintHandling?.supportiveDocuments);
    
    res.status(200).json({
      result: complaintHandling,
      message: "Complaint Handling Deleted Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
