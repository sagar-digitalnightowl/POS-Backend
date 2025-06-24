import draftModel from "../../models/sell/draft.model.js";
import customerModel from "../../models/contacts/customersAndSupplier.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addDraft = async (req, res) => {
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

    const uploadedDocuments = await handleFilesUpload(req.files, "Draft");

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

    const newDraft = new draftModel({
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

    await newDraft.save();

    res.status(201).json({
      message: "Draft added successfully",
      result: newDraft,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllDraft = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalDoc = await draftModel.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);

    const allDraft = await draftModel
      .find()
      .populate("customer")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!allDraft || allDraft.length === 0) {
      return res.status(404).json({ message: "No Sales found" });
    }

    return res.status(200).json({
      result: allDraft,
      totalPage,
      message: "Draft Retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getDraftById = async (req, res) => {
  try {
    const draftId = req.params.id;

    if (!draftId) {
      res.status(400).json({ error: "Draft Id is required" });
    }
    const draft = await draftModel.findById(draftId).populate("customer");

    if (!draft) {
      res.status(400).json({ error: `Draft is not found with id=${draftId}` });
    }

    return res
      .status(200)
      .json({ result: draft, message: "Draft Retrived Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updateDraftById = async (req, res) => {
  try {
    const data = req.body;
    const draftId = req.params.id;
    if (!draftId)
      return res.status(400).json({ error: "Draft Id is required" });

    const existDraft = await draftModel.findById(draftId);
    if (!existDraft) {
      return res.status(400).json({ error: "Draft not found" });
    }

    const verifyCustomer = await customerModel.findById(data.customer);
    if (!verifyCustomer) {
      return res.status(404).json({ error: "Customer is not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existDraft,
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

    const draftReturn = await draftModel.findByIdAndUpdate(
      draftId,
      {
        ...data,
        payTerm: parsedPayTerm,
        additionalExpenses: parsedExpenses,
        products: parsedProducts,
        totalPayable,
      },
      { new: true }
    );

    if (!draftReturn)
      return res
        .status(404)
        .json({ error: `Draft not found with id: ${draftId}` });

    return res
      .status(200)
      .json({ result: draftReturn, message: "Draft Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};


routes.deleteDraftById = async (req, res) => {
  try {
    const draftId = req.params.id;
    if (!draftId)
      return res.status(400).json({ error: "Draft Id is required" });
    const deleteDraft = await draftModel.findByIdAndDelete(draftId);

    if (!deleteDraft) {
      return res
        .status(404)
        .json({ error: `Draft not found with ID: ${draftId}` });
    }
    return res
      .status(200)
      .json({ result: deleteDraft, message: "Draft Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export default routes;
