import saleModel from "../../models/sell/sale.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import customerModel from "../../models/contacts/customersAndSupplier.model.js";
import {handleFilesUpload, updateFilesUpload} from "../../cloudService/fileService.js"
import fs from "fs";
// import { v4 as uuidv4 } from "uuid";
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addSales = async (req, res) => {
  try {
    const {
      customer,
      payTerm,
      saleDate,
      status,
      invoiceSchema,
      invoiceNo,
      discountType,
      discountAmount,
      orderTax,
      sellNote,
      shippingDetails,
      shippingAddress,
      shippingCharges,
      shippingStatus,
      deliveredTo,
      deliveryPerson,
      additionalExpenses,
      payments,
    } = req.body;

    // let documents = {
    //   attachDocument: null,
    //   shippingDocuments: null,
    // };

    const uploadedDocuments  = await handleFilesUpload(req.files, "Sale");

    // if (req.files) {
    //   for (const [key, fileArray] of Object.entries(req.files)) {
    //     if (fileArray && fileArray.length > 0) {
    //       const file = fileArray[0]; // Assuming single file upload for each key
    //       const localFilePath = `./public/temp/${file.filename}`;
    //       const moduleName = "Sale";

    //       const uploadResult = await uploadOnCloudinary(
    //         localFilePath,
    //         moduleName
    //       );
    //       if (uploadResult) {
    //         documents[key] = uploadResult.secure_url;
    //         fs.unlinkSync(localFilePath); // Clean up local file
    //       } else {
    //         throw new Error(`File upload for ${key} failed`);
    //       }
    //     } else {
    //       console.error(`No files found for key: ${key}`);
    //     }
    //   }
    // } else {
    //   console.log("No files were uploaded");
    // }

    const verifyCustomer = await customerModel.findById(customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }
    // if (!payTerm || typeof payTerm !== "object") {
    //     return res.status(400).json({ error: "Invalid or missing payTerm" });
    // }
    // if (!payTerm.value || !payTerm.unit) {
    //     return res.status(400).json({ error: "payTerm.value and payTerm.unit are required" });
    // }

    const newSale = new saleModel({
      customer,
      payTerm: payTerm
        ? {
            value: payTerm.value || null,
            unit: payTerm.unit || null,
          }
        : null,
      saleDate,
      status,
      invoiceSchema,
      invoiceNo,
      attachDocument: uploadedDocuments.attachDocument || null,
      discountType,
      discountAmount,
      orderTax,
      sellNote,
      shippingDetails,
      shippingAddress,
      shippingCharges,
      shippingStatus,
      deliveredTo,
      deliveryPerson,
      shippingDocuments: uploadedDocuments.shippingDocuments || null,
      additionalExpenses,
      payments,
    });

    await newSale.save();

    res.status(201).json({
      message: "Sale added successfully",
      sale: newSale,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllSales = async (req, res) => {
  try {
    const allSales = await saleModel.find().populate("customer");

    if (!allSales || allSales.length === 0) {
      return res.status(404).json({ message: "No Sales found" });
    }

    return res
      .status(200)
      .json({ result: allSales, message: "Sales retrieved successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getAllSaleslesById = async (req, res) => {
  try {
    const salesId = req.params.id;

    if (!salesId) {
      return res.status(400).json({ error: "Sales Id is required" });
    }

    const sales = await saleModel.findById(salesId).populate("customer");

    if (!sales) {
      return res
        .status(400)
        .json({ error: `Sales is not found with id ${salesId}` });
    }

    return res
      .status(200)
      .json({ result: sales, message: "Sales retrived successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updateSalesById = async (req, res) => {
  try {
    const salesId = req.params.id;
    const updateData = req.body;

    if (!salesId) {
      return res.status(400).json({ error: "Sales return Id is required" });
    }

    const verifyCustomer = await customerModel.findById(updateData.customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    const existSale = await saleModel.findById(salesId);

    // Handle file uploads if present
    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(req.files, existSale, "Sale");
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // Update the sale record
    const salesReturn = await saleModel.findByIdAndUpdate(salesId, updateData, { new: true });

    if (!salesReturn) {
      return res.status(404).json({ error: `Sales not found with id:${salesId} `});
    }

    return res.status(200).json({
      result: salesReturn,
      message: "Sales Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};


routes.deleteSalesById = async (req, res) => {
  try {
    const salesId = req.params.id;

    if (!salesId) {
      return res.status(400).json({ error: "Sales ID is required" });
    }

    // Find the sale first to get document URLs
    const sale = await saleModel.findById(salesId);
    if (!sale) {
      return res.status(404).json({ error: `Sales not found with ID: ${salesId}` });
    }

    // Delete files from Cloudinary if they exist
    const fileKeys = ["attachDocument", "shippingDocuments"]; // Keys that store file URLs

    for (const key of fileKeys) {
      if (sale[key]) {
        const decodedUrl = decodeURIComponent(sale[key]);
        const publicId = decodedUrl.replace(/^.*\/(POS_Project\/Sale\/)/, "$1").split(".")[0];

        console.log(`Deleting file from Cloudinary: ${publicId}`);
        const deleteResult = await deleteFromCloudinary(publicId);

        if (!deleteResult) {
          return res.status(500).json({ error: `Failed to delete ${key} from Cloudinary` });
        }
      }
    }

    // Delete the sale from the database
    await saleModel.findByIdAndDelete(salesId);

    return res.status(200).json({ message: "Sales Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};


export default routes;
