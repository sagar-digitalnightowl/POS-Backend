import disposeModel from "../../models/nhra/dispose.model.js";
import productModel from "../../models/products/productList.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import {
    deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addDispose = async (req, res) => {
  try {
    const {
      device,
      manufacturer,
      healthCareFacility,
      authorizedRepresentative,
      reasonOfDisposal,
    } = req.body;

    const existProduct = await productModel.findById(device);
    if (!existProduct) {
      return res.status(404).json({ error: "Device not found" });
    }
    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
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

    const uploadFiles = await handleFilesUpload(req.files, "Dispose");

    const parsedReasonOfDisposal = reasonOfDisposal
      ? JSON.parse(reasonOfDisposal)
      : [];

    const newDispose = new disposeModel({
      ...req.body,
      reasonOfDisposal: parsedReasonOfDisposal,
      supremeCouncilOfEnvironmentApproval:
        uploadFiles.supremeCouncilOfEnvironmentApproval,
      airwayBill: uploadFiles.airwayBill,
      destructionInvoice: uploadFile.destructionInvoice,
    });
    await newDispose.save();
    res
      .status(201)
      .json({ result: newDispose, message: "Dispose added successfully" });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllDispose = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await disposeModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allDispose = await disposeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("device", "productName")
      .populate("manufacturer", "name")
      .populate("authorizedRepresentative", "name");

    if (!allDispose || allDispose.length === 0) {
      return res.status(404).json({ message: "Dispose Event found" });
    }

    return res.status(200).json({
      result: allDispose,
      totalPage,
      message: "Dispose Retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getDisposeById = async (req, res) => {
  try {
    const disposeById = req.params.id;

    if (!disposeById) {
      res.status(400).json({ error: "Dispose Id is required" });
    }
    const dispose = await disposeModel.findById(disposeById);

    if (!dispose) {
      res
        .status(400)
        .json({ error: `Dispose is not found with ID ${disposeById}` });
    }
    res
      .status(200)
      .json({ result: dispose, message: "Dispose retrived Successfully" });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateDisposeById = async (req, res) => {
  try {
    const disposeById = req.params.id;
    const updateData = req.body;

    const {
      device,
      manufacturer,
      healthCareFacility,
      authorizedRepresentative,
      reasonOfDisposal,
    } = updateData;

    if (!disposeById) {
      res.status(400).json({ error: "Dispose Id is required" });
    }

    const existDispose = await disposeModel.findById(disposeById);

    if (!existDispose) {
      res
        .status(400)
        .json({ error: `Dispose is not found with Id ${disposeById}` });
    }

    const existProduct = await productModel.findById(device);
    if (!existProduct) {
      return res.status(404).json({ error: "Device not found" });
    }
    const existManufacturer = await manufacturerModel.findById(manufacturer);
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
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

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existDispose,
          "Dispose"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const parsedReasonOfDisposal = reasonOfDisposal
      ? JSON.parse(reasonOfDisposal)
      : [];

    const dispose = await disposeModel.findByIdAndUpdate(
      disposeById,
      {
        ...updateData,
        reasonOfDisposal: parsedReasonOfDisposal
      },
      { new: true }
    );

    res
      .status(200)
      .json({ result: dispose, message: "Dispose updated successfully" });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteDisposeById = async (req, res) => {
  try {
    const disposeById = req.params.id;

    if (!disposeById) {
      res.status(400).json({ error: "Dispose Id is required" });
    }
    const dispose = await disposeModel.findByIdAndDelete(disposeById);
    if (!dispose) {
      return res
        .status(400)
        .json({ error: `Dispose is not found with Id ${disposeById}` });
    }

    await deleteFileFromCloudinary(dispose?.supremeCouncilOfEnvironmentApproval);
    await deleteFileFromCloudinary(dispose?.airwayBill);
    await deleteFileFromCloudinary(dispose?.destructionInvoice);

    res
      .status(200)
      .json({ result: dispose, message: "Dispose Deleted Successfully" });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
