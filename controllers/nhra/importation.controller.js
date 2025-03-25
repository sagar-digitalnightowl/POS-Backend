import importationModel from "../../models/nhra/importation.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import productModel from "../../models/products/productList.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";

import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

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
      // invoice,
      // purchaseOrder,
      // catalogue,
      // freeSaleCertificate,
      // qualityAssuranceCertificate,

      authorizedRepresentativeName,

      manufacturerName,

      productName,
      qty,
      expiry,
      lotNo,
    } = req.body;

    let documents = {
      invoice: null,
      purchaseOrder: null,
      catalogue: null,
      freeSaleCertificate: null,
      qualityAssuranceCertificate: null,
    };

    // Handle file uploads for each document
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileKey = `importation/${uuidv4()}_${file.originalname}`;
        const uploadResult = await uploadFile(file, fileKey);

        // Match file field name with the corresponding document key
        if (file.fieldname in documents) {
          documents[file.fieldname] = uploadResult.Location;
        }
      }
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
    const product = await productModel.findById(productName);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

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
      ...documents,

      authorizedRepresentativeName,
      mobileNumber: authorizedRepresentative.phoneNumber,
      authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,

      manufacturerName,
      contactPersonNumber: manufacturer.phoneNumber,
      manufacturerEmail: manufacturer.email,
      manufacturerCountryOfOrigin: manufacturer.address,

      productName,
      qty,
      expiry,
      lotNo,
    });
    await newImportation.save();

    res
      .status(200)
      .json({
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
    const importations = await importationModel
      .find()
      .populate("authorizedRepresentativeName", "name phoneNumber emailAddress")
      .populate("manufacturerName", "name email phoneNumber address")
      .populate("productName", "productName isMedical")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({
        result: importations,
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
    const importation = await importationModel
      .findById(importationId)
      .populate("authorizedRepresentativeName", "name phoneNumber emailAddress")
      .populate("manufacturerName", "name email phoneNumber address")
      .populate("productName", "productName isMedical");

    if (!importation) {
      res
        .status(400)
        .json({ error: `Importation is not found with ID ${importationId}` });
    }
    res
      .status(200)
      .json({
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

    if (updateData.authorizedRepresentativeName) {
      const authorizedRepresentative =
        await authorizedRepresentativeModel.findById(updateData.authorizedRepresentativeName);
      if (!authorizedRepresentative) {
        return res
          .status(404)
          .json({ error: "Authorized Representative not found" });
      }
      updateData.mobileNumber = authorizedRepresentative.phoneNumber;
      updateData.authorizedRepresentativeEmail =
        authorizedRepresentative.emailAddress;
    }

    if (updateData.manufacturerName) {
      const manufacturer = await manufacturerModel.findById(updateData.manufacturerName);
      if (!manufacturer) {
        return res.status(404).json({ error: "Manufacturer not found" });
      }
      updateData.contactPersonNumber = manufacturer.phoneNumber;
      updateData.manufacturerEmail = manufacturer.email;
      updateData.manufacturerCountryOfOrigin = manufacturer.address;
    }

    if (updateData.productName) {
      const product = await productModel.findById(updateData.productName);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    const importation = await importationModel.findByIdAndUpdate(importationId,updateData,{ new: true });

    if (!importation) {
      res
        .status(400)
        .json({ error: `Importation is not found with ID ${importationId}` });
    }
    res
      .status(200)
      .json({
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
    return res
      .status(200)
      .json({
        result: importation,
        message: "Importation Updated Successfully",
      });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
