import safetyNoticeModel from "../../models/nhra/safetyNotice.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import { deleteFileFromCloudinary, handleFilesUpload, updateFilesUpload } from "../../cloudService/fileService.js";

const routes = {};

routes.addSafetyNotice = async (req, res) => {
  try {
    const {
      manufacturer,
      device,
      authorizedRepresentative,
      healthCareFacility,
    } = req.body;

    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthCareFacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
    }

    const uploadedFiles = await handleFilesUpload(
      req.files,
      "Field Safety Notice"
    );

    const newSafetyNotice = new safetyNoticeModel({
      ...req.body,
      copyOfReport: uploadedFiles.copyOfReport,
      lpo: uploadedFiles.lpo,
      importationHistory: uploadedFiles.importationHistory,
      nhraMedicalDeviceRegistrationLicense:
        uploadedFiles.nhraMedicalDeviceRegistrationLicense,
      returnInvoice: uploadedFiles.returnInvoice,
      destructionInvoice: uploadedFiles.destructionInvoice,
      acknowledgment: uploadedFiles.acknowledgment,
      signature: uploadedFiles.signature,
      signatureDeclarationLetter: uploadedFiles.signatureDeclarationLetter,
    });
    await newSafetyNotice.save();
    res.status(201).json({
      result: newSafetyNotice,
      message: "Safety Notice added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllSafetyNotice = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await safetyNoticeModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allSafetyNotice = await safetyNoticeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('device', 'productName')
      .populate('manufacturer', 'name country');

    if (!allSafetyNotice || allSafetyNotice === 0) {
      return res.status(400).json({ error: "No Safety Notice found" });
    }
    res.status(200).json({
      result: allSafetyNotice,
      totalPage,
      message: "Safety Notice retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getSafetyNoticeById = async (req, res) => {
  try {
    const safetyNoticeId = req.params.id;

    if (!safetyNoticeId) {
      res.status(400).json({ error: "Safety Notice Id is required" });
    }
    const safetyNotice = await safetyNoticeModel.findById(safetyNoticeId);

    if (!safetyNotice) {
      res.status(400).json({
        error: `Safety Notice is not found with ID ${safetyNoticeId}`,
      });
    }
    res.status(200).json({
      result: safetyNotice,
      message: "Safety Notice retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateSafetyNoticeById = async (req, res) => {
  try {
    const safetyNoticeId = req.params.id;
    const updateData = req.body;

    const existSafetyNotice = await safetyNoticeModel.findById(safetyNoticeId);

    if (!existSafetyNotice) {
      res.status(400).json({
        error: `Safety Notice is not found with Id ${safetyNoticeId}`,
      });
    }

    const {
      manufacturer,
      device,
      authorizedRepresentative,
      healthCareFacility,
    } = req.body;

    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentative);
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthCareFacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existSafetyNotice,
          "Field Safety Notice"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const safetyNotice = await safetyNoticeModel.findByIdAndUpdate(
      safetyNoticeId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      result: safetyNotice,
      message: "Safety Notice updated successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteSafetyNoticeById = async (req, res) => {
  try {
    const safetyNoticeId = req.params.id;

    if (!safetyNoticeId) {
      res.status(400).json({ error: "Safety Notice Id is required" });
    }
    const safetyNotice = await safetyNoticeModel.findByIdAndDelete(
      safetyNoticeId
    );
    if (!safetyNotice) {
      return res.status(400).json({
        error: `Safety Notice is not found with Id ${safetyNoticeId}`,
      });
    }

    await deleteFileFromCloudinary(safetyNoticeId?.copyOfReport);
    await deleteFileFromCloudinary(safetyNoticeId?.lpo);
    await deleteFileFromCloudinary(safetyNoticeId?.importationHistory);
    await deleteFileFromCloudinary(safetyNoticeId?.nhraMedicalDeviceRegistrationLicense);
    await deleteFileFromCloudinary(safetyNoticeId?.returnInvoice);
    await deleteFileFromCloudinary(safetyNoticeId?.destructionInvoice);
    await deleteFileFromCloudinary(safetyNoticeId?.acknowledgment);
    await deleteFileFromCloudinary(safetyNoticeId?.signature);
    await deleteFileFromCloudinary(safetyNoticeId?.signatureDeclarationLetter);

    res.status(200).json({
      result: safetyNotice,
      message: "Safety Notice Deleted Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
