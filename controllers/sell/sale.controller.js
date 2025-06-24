import saleModel from "../../models/sell/sale.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import customerModel from "../../models/contacts/customersAndSupplier.model.js";
import {
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";
import fs from "fs";
import SaleReportModel from "../../models/reports/SaleReport.model.js";
// import { v4 as uuidv4 } from "uuid";
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addSales = async (req, res) => {
  try {
    const {
      location,
      customer,
      payTerm,
      saleDate,
      status,
      invoiceSchema,
      invoiceNo,
      products,
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

    const verifyCustomer = await customerModel.findById(customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    const uploadedDocuments = await handleFilesUpload(req.files, "Sale");

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];
    const parsedPayments = payments ? JSON.parse(payments) : {};

    if (parsedProducts?.length === 0) {
      return res.status(400).json({ error: "add atleast one product" });
    }

    let allProductsAmount = 0;
    if (parsedProducts?.length > 0) {
      parsedProducts.map((product) => {
        allProductsAmount += product.totalAmount;
      });
    }

    let allAdditionalExpenseAmount = 0;
    if (parsedExpenses?.length > 0) {
      parsedExpenses.map((expense) => {
        allAdditionalExpenseAmount += Number(expense.amount || 0);
      });
    }

    let totalDiscountAmount = 0;
    if (discountType === "Fixed") {
      totalDiscountAmount = discountAmount;
    } else if (discountType === "Percentage") {
      totalDiscountAmount = allProductsAmount * (discountAmount / 100);
    }

    let totalBalance =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(shippingCharges || 0) +
      Number(allAdditionalExpenseAmount || 0) -
      Number(parsedPayments.amount || 0).toFixed(2);

    const newSale = new saleModel({
      location,
      customer,
      payTerm: parsedPayTerm,
      saleDate,
      status,
      invoiceSchema,
      invoiceNo,
      attachDocument: uploadedDocuments.attachDocument || null,
      products: parsedProducts,
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
      additionalExpenses: parsedExpenses,
      payments: parsedPayments,
      totalBalance,
    });

    await newSale.save();

    // create sale report for new sale
    await SaleReportModel.create({
      sale: newSale?._id,
    });

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
    const { page = 1, limit = 10 } = req.query;

    const totalItem = await saleModel.countDocuments();
    const totalPage = Math.ceil(totalItem / limit);

    const allSales = await saleModel
      .find()
      .populate("customer")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!allSales || allSales.length === 0) {
      return res.status(404).json({ message: "No Sales found" });
    }

    return res.status(200).json({
      result: allSales,
      totalPage,
      message: "Sales retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getSales = async (req, res) => {
  try {
    const allSales = await saleModel.find().select("invoiceNo saleDate");

    return res.status(200).json({
      result: allSales,
      message: "Sales retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getSaleById = async (req, res) => {
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

    const existSale = await saleModel.findById(salesId);
    if (!existSale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const verifyCustomer = await customerModel.findById(updateData.customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    // Handle file uploads if present

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existSale,
          "Sale"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const {
      payTerm,
      products,
      additionalExpenses,
      payments,
      discountType,
      discountAmount,
      shippingCharges,
    } = updateData;

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];
    const parsedPayments = payments ? JSON.parse(payments) : {};

    if (parsedProducts?.length === 0) {
      return res.status(400).json({ error: "add atleast one product" });
    }

    let allProductsAmount = 0;
    if (parsedProducts?.length > 0) {
      parsedProducts.map((product) => {
        allProductsAmount += product.totalAmount;
      });
    }

    let allAdditionalExpenseAmount = 0;
    if (parsedExpenses?.length > 0) {
      parsedExpenses.map((expense) => {
        allAdditionalExpenseAmount += Number(expense.amount || 0);
      });
    }

    let totalDiscountAmount = 0;
    if (discountType === "Fixed") {
      totalDiscountAmount = discountAmount;
    } else if (discountType === "Percentage") {
      totalDiscountAmount = allProductsAmount * (discountAmount / 100);
    }

    let totalBalance =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(shippingCharges || 0) +
      Number(allAdditionalExpenseAmount || 0) -
      Number(parsedPayments.amount || 0).toFixed(2);

    // Update the sale record
    const salesReturn = await saleModel.findByIdAndUpdate(
      salesId,
      {
        ...updateData,
        payTerm: parsedPayTerm,
        additionalExpenses: parsedExpenses,
        payments: parsedPayments,
        products: parsedProducts,
        totalBalance,
      },
      { new: true }
    );

    if (!salesReturn) {
      return res
        .status(404)
        .json({ error: `Sales not found with id:${salesId} ` });
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
      return res
        .status(404)
        .json({ error: `Sales not found with ID: ${salesId}` });
    }

    // Delete files from Cloudinary if they exist
    const fileKeys = ["attachDocument", "shippingDocuments"]; // Keys that store file URLs

    for (const key of fileKeys) {
      if (sale[key]) {
        const decodedUrl = decodeURIComponent(sale[key]);

        const match = decodedUrl.match(/upload\/v\d+\/(.+)\.[a-zA-Z]+$/);
        const publicId = match ? match[1] : null;

        console.log(`Deleting file from Cloudinary: ${publicId}`);
        const deleteResult = await deleteFromCloudinary(publicId);

        if (!deleteResult) {
          return res
            .status(500)
            .json({ error: `Failed to delete ${key} from Cloudinary` });
        }
      }
    }

    // Delete the sale from the database
    const deletedSale = await saleModel.findByIdAndDelete(salesId);

    //Delete the sale report from DB
    await SaleReportModel.deleteOne({ sale: deletedSale?._id });

    return res.status(200).json({ message: "Sales Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export default routes;
