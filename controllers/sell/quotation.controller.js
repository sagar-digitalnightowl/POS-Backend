import quotationModel from "../../models/sell/quotation.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";
import customerModel from "../../models/contacts/customersAndSupplier.model.js";

const routes = {};

routes.addquotation = async (req, res) => {
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
    } = req.body;

    const verifyCustomer = await customerModel.findById(customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    const uploadedDocuments = await handleFilesUpload(req.files, "Quotation");

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];

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

    let totalPayable =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(shippingCharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    const newquotation = new quotationModel({
      location,
      customer,
      payTerm: parsedPayTerm,
      saleDate,
      status,
      invoiceSchema,
      invoiceNo,
      attachDocument: uploadedDocuments.attachDocument,
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
      shippingDocuments: uploadedDocuments.shippingDocuments,
      additionalExpenses: parsedExpenses,
      totalPayable,
    });

    await newquotation.save();

    res.status(201).json({
      message: "Quotation added successfully",
      sale: newquotation,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllQuotation = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalDoc = await quotationModel.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);

    const allQuotation = await quotationModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("customer");

    if (!allQuotation || allQuotation.length == 0) {
      return res.status(400).json({ error: "No Quotation found" });
    }

    return res.status(200).json({
      result: allQuotation,
      totalPage,
      message: "Quotation retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getQuotationById = async (req, res) => {
  try {
    const quotationId = req.params.id;

    if (!quotationId) {
      res.status(400).json({ error: "Quotation Id Required" });
    }
    const quotation = await quotationModel
      .findById(quotationId)
      .populate("customer");

    if (!quotation) {
      res
        .status(400)
        .json({ error: `Quotation not found qith id ${quotationId}` });
    }
    return res
      .status(200)
      .json({ result: quotation, message: "Quotation retrived Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateQuotationById = async (req, res) => {
  try {
    const data = req.body;
    const quotationId = req.params.id;

    if (!quotationId) {
      res.status(400).json({ error: "Quotation Id Required" });
    }
    const existQuotation = await quotationModel.findById(quotationId);
    if (!existQuotation) {
      return res.status(400).json({ error: "Quotation not found" });
    }

    const verifyCustomer = await customerModel.findById(data.customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existQuotation,
          "Draft"
        );
        Object.assign(data, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const {
      payTerm,
      products,
      additionalExpenses,
      discountType,
      discountAmount,
      shippingCharges,
    } = data;

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];

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
    if (parsedExpenses.length > 0) {
      parsedExpenses.map((expense) => {
        allAdditionalExpenseAmount += Number(expense.amount || 0);
      });
    }

    let totalDiscountAmount = 0;
    if (discountType === "Fixed") {
      totalDiscountAmount = Number(discountAmount || 0);
    } else if (discountType === "Percentage") {
      totalDiscountAmount = allProductsAmount * (discountAmount / 100);
    }

    let totalPayable =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(shippingCharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    const quotation = await quotationModel.findByIdAndUpdate(
      quotationId,
      {
        ...data,
        payTerm: parsedPayTerm,
        additionalExpenses: parsedExpenses,
        products: parsedProducts,
        totalPayable,
      },
      { new: true }
    );

    if (!quotation)
      return res
        .status(404)
        .json({ error: `Quotation not found with id:${quotationId}` });
    return res
      .status(200)
      .json({ result: quotation, message: "Quotation Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteQuotationById = async (req, res) => {
  try {
    const quotationId = req.params.id;

    if (!quotationId) {
      res.status(400).json({ error: "Quotation Id Required" });
    }
    const quotation = await quotationModel.findByIdAndDelete(quotationId);

    if (!quotation)
      return res
        .status(404)
        .json({ error: `Quotation not found with id:${quotationId}` });
    return res
      .status(200)
      .json({ result: quotation, message: "Quotation Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export default routes;
