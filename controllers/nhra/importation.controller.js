import importationModel from "../../models/nhra/importation.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import productModel from "../../models/products/productList.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addImportation = async (req, res) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      deliveryMethod,
      paymentMethod,
      cRNumber,
      ofoqLicenseNumber,
      grn,
      lpo,
      portOfDelivery,
      dateOfDelivery,
      totalPayment,
      totalTax,
      authorizedRepresentative,
      manufacturer,
      products,
    } = req.body;

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

    const uploadedDocuments = await handleFilesUpload(req.files, "Importation");

    const parsedProduct = products ? JSON.parse(products) : [];

    const newImportation = new importationModel({
      invoiceNo,
      invoiceDate,
      deliveryMethod,
      paymentMethod,
      cRNumber,
      ofoqLicenseNumber,
      grn,
      lpo,
      portOfDelivery,
      dateOfDelivery,
      totalPayment,
      totalTax,
      invoice: uploadedDocuments?.invoice,
      purchaseOrder: uploadedDocuments?.purchaseOrder,
      catalogue: uploadedDocuments?.catalogue,
      freeSaleCertificate: uploadedDocuments?.freeSaleCertificate,
      qualityAssuranceCertificate:
        uploadedDocuments.qualityAssuranceCertificate,
      authorizedRepresentative,
      manufacturer,
      products: parsedProduct,
    });
    await newImportation.save();

    res.status(201).json({
      result: newImportation,
      message: "Importation Added Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getAllImportation = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await importationModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const importations = await importationModel
      .find()
      .populate("authorizedRepresentative", "name phoneNumber emailAddress")
      .populate("manufacturer", "name email phoneNumber address, country")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      result: importations,
      totalPage,
      message: "Importations retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getImportationById = async (req, res) => {
  try {
    const importationId = req.params.id;

    if (!importationId) {
      res.status(400).json({ error: "Importation Id is required" });
    }
    const importation = await importationModel.findById(importationId);

    if (!importation) {
      res
        .status(400)
        .json({ error: `Importation is not found with ID ${importationId}` });
    }
    res.status(200).json({
      result: importation,
      message: "Importation retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateImportationById = async (req, res) => {
  try {
    const importationId = req.params.id;
    const updateData = req.body;

    if (!importationId) {
      return res.status(400).json({ error: "Importation Id is required" });
    }

    const existImportation = await importationModel.findById(importationId);
    if (!existImportation) {
      return res.status(404).json({
        error: "Importation not found",
      });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(
        updateData?.authorizedRepresentative
      );
    if (!existAuthorizedRepresentative) {
      return res
        .status(404)
        .json({ error: "Authorized Representative not found" });
    }

    const existManufacturer = await manufacturerModel.findById(
      updateData?.manufacturer
    );
    if (!existManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existImportation,
          "Importation"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (updateData?.products) {
      updateData.products = JSON.parse(updateData.products);
    }

    const importation = await importationModel.findByIdAndUpdate(
      importationId,
      updateData,
      { new: true }
    );

    if (!importation) {
      res
        .status(400)
        .json({ error: `Importation is not found with ID ${importationId}` });
    }
    res.status(200).json({
      result: importation,
      message: "Importation updated Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteImportationById = async (req, res) => {
  try {
    const importationId = req.params.id;

    if (!importationId) {
      res.status(400).json({ error: "Importation Id is required" });
    }

    const importation = await importationModel.findByIdAndDelete(importationId);

    if (!importation)
      return res
        .status(404)
        .json({ error: `Importation not found with id:${importationId}` });

    await deleteFileFromCloudinary(importation?.invoice);
    await deleteFileFromCloudinary(importation?.purchaseOrder);
    await deleteFileFromCloudinary(importation?.catalogue);
    await deleteFileFromCloudinary(importation?.freeSaleCertificate);
    await deleteFileFromCloudinary(importation?.qualityAssuranceCertificate);

    return res.status(200).json({
      result: importation,
      message: "Importation Updated Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
