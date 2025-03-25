import alert_ModificationModel from "../../models/nhra/alerts_Modification.model.js";
import productModel from "../../models/products/productList.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import fs from "fs";
// import { v4 as uuidv4 } from "uuid";
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addAlert_Modification = async (req, res) => {
  try {
    const {
      applicantName,
      applicantEmail,
      applicantMobNo,
      applicantCPRnumber,
      eventDate,
      deviceName,
      authorizedRepresentativeName,
      manufacturerName,
      alertRiskClassification,
      reason,
      change,
      wasAnyoneInjured,
      ifYesWasTheInjury,
      nhraReportingStatus,
      severity,
      patternOfEvents,
      categoryOfEvent,
      whereIsTheDeviceNow,
      descriptionOfEvent,
      descriptionOfChange,
      modification,
      otherModification,
      modificationDescription,
    } = req.body;

    let modificationDocument = null;

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "alert_Modification";

      const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);

      if (uploadResult) {
        modificationDocument = uploadResult.secure_url; // Use Cloudinary's secure URL
        fs.unlinkSync(localFilePath); // Clean up temporary file
      } else {
        throw new Error("File upload to Cloudinary failed");
      }
    }
    console.log("Uploaded Files: ", req.file);

    const device = await productModel.findById(deviceName);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const authorizedRepresentative =
      await authorizedRepresentativeModel.findById(
        authorizedRepresentativeName
      );
    if (!authorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const manufacturer = await manufacturerModel.findById(manufacturerName);
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    const newAlert_Modification = new alert_ModificationModel({
      applicantName,
      applicantEmail,
      applicantMobNo,
      applicantCPRnumber,
      eventDate: eventDate || Date.now(),
      deviceName,
      modelNumber: device.productModel,
      gmdnCode: device.productGMDNCode,
      serialNumber: device.productSerialNo,
      hsCode: device.productHSCode,
      batchNumber: device.batchNo,

      authorizedRepresentativeName,
      mobileNumber: authorizedRepresentative.phoneNumber,
      authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,
      authorizedRepresentativeLicense: authorizedRepresentative.licenseNumber,

      manufacturerName,
      contactPersonNumber: manufacturer.phoneNumber,
      manufacturerEmail: manufacturer.email,
      countryOfOrigin: manufacturer.country,
      alertRiskClassification,
      reason,
      change,
      wasAnyoneInjured,
      ifYesWasTheInjury,
      nhraReportingStatus,
      severity,
      patternOfEvents,
      categoryOfEvent,
      whereIsTheDeviceNow,
      descriptionOfEvent,
      descriptionOfChange,
      modification,
      otherModification,
      modificationDescription,
      modificationDocument,
    });
    await newAlert_Modification.save();

    return res.status(200).json({
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
    const allAlert_Modification = await alert_ModificationModel
      .find()
      .populate("deviceName", "productName")
      .populate("authorizedRepresentativeName", "name")
      .populate("manufacturerName", "name");

    if (!allAlert_Modification || allAlert_Modification.length === 0) {
      return res
        .status(404)
        .json({ error: "Alert & Modification are not found" });
    }
    return res.status(200).json({
      result: allAlert_Modification,
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

    if (updateData.deviceName) {
      const device = await productModel.findById(updateData.deviceName);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      updateData.modelNumber = device.productModel;
      updateData.gmdnCode = device.productGMDNCode;
      updateData.serialNumber = device.productSerialNo;
      updateData.hsCode = device.productHSCode;
      updateData.batchNumber = device.batchNo;
    }
    if (updateData.authorizedRepresentativeName) {
      const authorizedRepresentative =
        await authorizedRepresentativeModel.findById(
          updateData.authorizedRepresentativeName
        );
      if (!authorizedRepresentative) {
        return res
          .status(404)
          .json({ error: "Authorized Representative not found" });
      }
      updateData.mobileNumber = authorizedRepresentative.phoneNumber;
      updateData.authorizedRepresentativeEmail =
        authorizedRepresentative.emailAddress;
      updateData.authorizedRepresentativeLicense =
        authorizedRepresentative.licenseNumber;
    }
    if (updateData.manufacturerName) {
      const manufacturer = await manufacturerModel.findById(updateData.manufacturerName);
      if (!manufacturer) {
        return res.status(404).json({ error: "Manufacturer not found" });
      }
      updateData.contactPersonNumber = manufacturer.phoneNumber;
      updateData.manufacturerEmail = manufacturer.email;
      updateData.countryOfOrigin = manufacturer.country;
    }

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "alert_Modification";

      const existingAlert = await alert_ModificationModel.findById(
        alert_ModificationById
      );
      if (existingAlert && existingAlert.modificationDocument) {
        const modificationDocumentUrl = existingAlert.modificationDocument;

        // Decode the URL to handle encoded characters like %20
        const decodedUrl = decodeURIComponent(modificationDocumentUrl);
        const publicId = decodedUrl
          .replace(/^.*\/(POS_Project\/alert_Modification\/)/, "$1")
          .split(".")[0];

        console.log("Public ID for deletion:", publicId);
        const deleteResult = await deleteFromCloudinary(publicId);
        console.log("Delete result:", deleteResult);
        if (!deleteResult) {
          return res
            .status(500)
            .json({ error: "Failed to delete the old file from Cloudinary" });
        }
      }

      const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);

      if (uploadResult) {
        updateData.modificationDocument = uploadResult.secure_url; // Store Cloudinary URL
        fs.unlinkSync(localFilePath); // Clean up temporary file after upload
      } else {
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    const alert_Modification = await alert_ModificationModel.findByIdAndUpdate(
      alert_ModificationById,
      updateData,
      { new: true, runValidators: true }
    );
    if (!alert_Modification) {
      return res.status(404).json({
        error: `Alert & Modification is not found with Id ${alert_ModificationById}`,
      });
    }
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

    // Find the alert modification to retrieve the associated file URL
    const alert_Modification = await alert_ModificationModel.findById(alert_ModificationId);

    if (!alert_Modification) {
      return res.status(404).json({
        error: `Alert Modification is not found with id ${alert_ModificationId}`,
      });
    }

    // Extract the modificationDocument URL and decode it
    const modificationDocumentUrl = alert_Modification.modificationDocument;
    const decodedUrl = decodeURIComponent(modificationDocumentUrl);

    // Extract Cloudinary public ID from the URL
    const publicId = decodedUrl
      .replace(/^.*\/(POS_Project\/alert_Modification\/)/, "$1") // Keep only the relevant part of the path
      .split(".")[0]; // Remove the file extension

    console.log("Public ID for deletion:", publicId);

    // Attempt to delete the file from Cloudinary
    const deleteResult = await deleteFromCloudinary(publicId);
    console.log("Delete result:", deleteResult);

    if (!deleteResult) {
      return res.status(500).json({ error: "Failed to delete the file from Cloudinary" });
    }

    // Proceed to delete the document from the database
    await alert_ModificationModel.findByIdAndDelete(alert_ModificationId);

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
