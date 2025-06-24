import alert_ModificationModel from "../../models/nhra/alerts_Modification.model.js";
import productModel from "../../models/products/productList.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";


import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";
// import { v4 as uuidv4 } from "uuid";
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addAlert_Modification = async (req, res) => {
  try {
    const { device, authorizedRepresentative, manufacturer, reason } = req.body;

    const existDevice = await productModel.findById(device);
    if (!existDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    const uploadFile = await handleFilesUpload(req.files, "Alert");

    const parsedReason = reason ? JSON.parse(reason) : [];

    const newAlert_Modification = new alert_ModificationModel({
      ...req.body,
      reason: parsedReason,
      modificationDocument: uploadFile.modificationDocument,
    });
    await newAlert_Modification.save();

    return res.status(201).json({
      result: newAlert_Modification,
      message: "Alert & Modification added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllAlert_Modification = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await alert_ModificationModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allAlert_Modification = await alert_ModificationModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("device", "productName")
      .populate("authorizedRepresentative", "name")
      .populate("manufacturer", "name");

    if (!allAlert_Modification || allAlert_Modification.length === 0) {
      return res
        .status(404)
        .json({ error: "Alert & Modification are not found" });
    }
    return res.status(200).json({
      result: allAlert_Modification,
      totalPage,
      message: "Data retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAlert_ModificationById = async (req, res) => {
  try {
    const alert_ModificationById = req.params.id;
    if (!alert_ModificationById)
      return res.status(400).json({ error: "Id is required" });

    const alert_Modification = await alert_ModificationModel.findById(
      alert_ModificationById
    );
    if (!alert_Modification)
      return res
        .status(404)
        .json({ error: "Alert Modification not found with this id" });
    return res.status(200).json({
      result: alert_Modification,
      message: "Alert Modification fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateAlert_ModificationById = async (req, res) => {
  try {
    const alert_ModificationById = req.params.id;
    const updateData = req.body;

    if (!alert_ModificationById)
      return res.status(400).json({ error: "Id is required" });

    const existAlert = await alert_ModificationModel.findById(
      alert_ModificationById
    );

    if (!existAlert) {
      return res.status(404).json({
        error: `Alert & Modification is not found with Id ${alert_ModificationById}`,
      });
    }

    const { device, authorizedRepresentative, manufacturer, reason } =
      updateData;

    const existDevice = await productModel.findById(device);
    if (!existDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existAlert,
          "Alert"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const parsedReason = reason ? JSON.parse(reason) : [];

    const alert_Modification = await alert_ModificationModel.findByIdAndUpdate(
      alert_ModificationById,
      { ...updateData, reason: parsedReason },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      result: alert_Modification,
      message: "Alert & Modification updated successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteAlert_ModificationById = async (req, res) => {
  try {
    const alert_ModificationId = req.params.id;

    if (!alert_ModificationId)
      return res.status(400).json({ error: "Id is required" });

    // Proceed to delete the document from the database
    const alert_Modification = await alert_ModificationModel.findByIdAndDelete(alert_ModificationId);

    if (!alert_Modification) {
      return res.status(404).json({
        error: `Alert Modification is not found with id ${alert_ModificationId}`,
      });
    }

    await deleteFileFromCloudinary(alert_Modification?.modificationDocument)

    res.status(200).json({
      result: alert_Modification,
      message: "Alert & Modifications deleted successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
