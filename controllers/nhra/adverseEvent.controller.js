import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import adverseEventModel from "../../models/nhra/adverseEvent.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addAdverseEvent = async (req, res) => {
  try {

    // console.log(req.body, "request body")
    const {
      device,
      healthCareFacility,     
      authorizedRepresentative,
      manufacturer,
      deviceLocationDept,
    } = req.body;

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthCareFacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
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

    const uploadedFiles = await handleFilesUpload(req.files, "Adverse Event");

    const parsedDeviceLocationDept = deviceLocationDept
      ? JSON.parse(deviceLocationDept)
      : [];

    const newAdverseEvent = new adverseEventModel({
      ...req.body,
      deviceLocationDept: parsedDeviceLocationDept,
    });
    await newAdverseEvent.save();

    res.status(201).json({
      result: newAdverseEvent,
      message: "Adverse Event added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllAdverseEvent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await adverseEventModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allAdverseEvent = await adverseEventModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("device", "productName")
      ;

    if (!allAdverseEvent || allAdverseEvent.length === 0) {
      return res.status(404).json({ error: "No Adverse Event found" });
    }

    return res.status(200).json({
      result: allAdverseEvent,
      totalPage,
      message: "Adverse Event Retrived Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAdverseEventById = async (req, res) => {
  try {
    const adverseEventId = req.params.id;

    if (!adverseEventId) {
      res.status(400).json({ error: "Adverse Event Id is required" });
    }
    const adverseEvent = await adverseEventModel.findById(adverseEventId);

    if (!adverseEvent) {
      res.status(400).json({
        error: `Adverse Event is not found with ID ${adverseEventId}`,
      });
    }
    res.status(200).json({
      result: adverseEvent,
      message: "Adverse Event retrived Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateAdverseEventById = async (req, res) => {
  try {
    const adverseEventId = req.params.id;
    const updateData = req.body;

    const {
      device,
      healthCareFacility,
      authorizedRepresentative,
      manufacturer,
      deviceLocationDept,
    } = req.body;

    if (!adverseEventId) {
      res.status(400).json({ error: "Adverse Event Id is required" });
    }

    const existAdverseEvent = await adverseEventModel.findById(adverseEventId);

    if (!existAdverseEvent) {
      return res.status(400).json({
        error: `Adverse Event is not found with ID : ${adverseEventId}`,
      });
    }

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthCareFacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
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
          existAdverseEvent,
          "Adverse Event"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const parsedDeviceLocationDept = deviceLocationDept
      ? JSON.parse(deviceLocationDept)
      : [];

    const adverseEvent = await adverseEventModel.findByIdAndUpdate(
      adverseEventId,
      {
        ...updateData,
        deviceLocationDept: parsedDeviceLocationDept,
      },
      { new: true }
    );

    res.status(200).json({
      result: adverseEvent,
      message: "Adverse Event updated Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteAdverseEventById = async (req, res) => {
  try {
    const adverseEventId = req.params.id;

    if (!adverseEventId) {
      res.status(400).json({ error: "Adverse Event Id is required" });
    }

    const adverseEvent = await adverseEventModel.findByIdAndDelete(
      adverseEventId
    );

    if (!adverseEvent) {
      return res.status(400).json({
        error: `Adverse Event is not found with Id ${adverseEventId}`,
      });
    }

    await deleteFileFromCloudinary(adverseEvent?.supportiveDocuments);
    await deleteFileFromCloudinary(adverseEvent?.signature);

    res.status(200).json({
      result: adverseEvent,
      message: "Adverse Event Deleted Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
