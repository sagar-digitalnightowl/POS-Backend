import purchaseModel from "../../models/purchase/purchase.model.js";
import supplierModel from "../../models/contacts/customersAndSupplier.model.js";
import { purchaseValidation } from "../../validations/joi.validations.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";
import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";
import PurchaseReportModel from "../../models/reports/PurchaseReport.model.js";

const routes = {};

routes.addPurchase = async (req, res) => {
  try {
    const { error } = purchaseValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const supplier = await supplierModel.findById(req.body.supplier);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    const uploadedDocuments = await handleFilesUpload(req.files, "Purchase");

    const {
      payTerm,
      products,
      additionalExpenses,
      discountType,
      discountAmount,
      additionalShippingcharges,
      payments,
    } = req.body;

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedAdditionalExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];
    const parsedPayments = payments ? JSON.parse(payments) : {};

    let allProductsAmount = 0;
    if (parsedProducts?.length > 0) {
      parsedProducts.map((product) => {
        allProductsAmount += product.totalAmount;
      });
    }

    let allAdditionalExpenseAmount = 0;
    if (parsedAdditionalExpenses?.length > 0) {
      parsedAdditionalExpenses.map((expense) => {
        allAdditionalExpenseAmount += Number(expense.amount || 0);
      });
    }

    let totalDiscountAmount = 0;
    if (discountType === "Fixed") {
      totalDiscountAmount = discountAmount;
    } else if (discountType === "Percentage") {
      totalDiscountAmount = allProductsAmount * (discountAmount / 100);
    }

    // purchase tax is on panding now

    const totalPurchaseAmount =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(additionalShippingcharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    const newPurchase = new purchaseModel({
      ...req.body,
      totalPurchaseAmount,
      attachDocument: uploadedDocuments?.attachDocument,
      payTerm: parsedPayTerm,
      products: parsedProducts,
      additionalExpenses: parsedAdditionalExpenses,
      payments: parsedPayments,
    });

    const savedPurchase = await newPurchase.save();

    await PurchaseReportModel.create({
      purchase: savedPurchase?._id,
    });

    supplier.totalPurchaseDue = (
      Number(supplier.totalPurchaseDue || 0) +
      totalPurchaseAmount -
      Number(parsedPayments?.amount || 0)
    ).toFixed(2);

    await supplier.save();

    return res.status(201).json({
      result: savedPurchase,
      message: "Purchase document created successfully",
    });
  } catch (error) {
    console.error("Error creating purchase:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllPurchase = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalDoc = await purchaseModel.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);

    const purchases = await purchaseModel
      .find()
      .populate("supplier")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found" });
    }

    return res
      .status(200)
      .json({
        result: purchases,
        totalPage,
        message: "Purchases retrieved successfully",
      });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getPurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      return res.status(400).json({ error: "Purchase ID is required" });
    }

    const purchase = await purchaseModel
      .findById(purchaseId)
      .populate("supplier");

    if (!purchase) {
      return res
        .status(404)
        .json({ error: `Purchase not found with ID: ${purchaseId}` });
    }

    return res
      .status(200)
      .json({ result: purchase, message: "Purchase Retrieved Successfully" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updatePurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const updateData = req.body;

    if (!purchaseId)
      return res.status(400).json({ error: "Purchase Id is required" });

    const purchase = await purchaseModel.findById(purchaseId);
    if (!purchase)
      return res
        .status(404)
        .json({ error: `Purchase not found with id:${purchaseId}` });

    const supplier = await supplierModel.findById(purchase?.supplier);

    let supplierPaymentDues = supplier.totalPurchaseDue;

    supplierPaymentDues -=
      Number(purchase?.totalPurchaseAmount || 0) -
      Number(purchase?.payments?.amount || 0);

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          purchase,
          "Purchase"
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
      discountType,
      discountAmount,
      additionalShippingcharges,
      payments,
    } = req.body;

    const parsedPayTerm = payTerm ? JSON.parse(payTerm) : {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedAdditionalExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];
    const parsedPayments = payments ? JSON.parse(payments) : {};

    let allProductsAmount = 0;
    if (parsedProducts?.length > 0) {
      parsedProducts.map((product) => {
        allProductsAmount += product.totalAmount;
      });
    }

    let allAdditionalExpenseAmount = 0;
    if (parsedAdditionalExpenses?.length > 0) {
      parsedAdditionalExpenses.map((expense) => {
        allAdditionalExpenseAmount += Number(expense.amount || 0);
      });
    }

    let totalDiscountAmount = 0;
    if (discountType === "Fixed") {
      totalDiscountAmount = discountAmount;
    } else if (discountType === "Percentage") {
      totalDiscountAmount = allProductsAmount * (discountAmount / 100);
    }

    // purchase tax is on panding now

    const totalPurchaseAmount =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(additionalShippingcharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    supplier.totalPurchaseDue = (
      supplierPaymentDues +
      totalPurchaseAmount -
      Number(parsedPayments?.amount || 0)
    ).toFixed(2);

    const updatedPurchase = await purchaseModel.findByIdAndUpdate(
      purchaseId,
      {
        ...updateData,
        totalPurchaseAmount,
        payTerm: parsedPayTerm,
        products: parsedProducts,
        additionalExpenses: parsedAdditionalExpenses,
        payments: parsedPayments,
      },
      { new: true }
    );

    await supplier.save();

    return res.status(200).json({
      result: updatedPurchase,
      message: "Purchase Updated Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deletePurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      return res.status(400).json({ error: "Purchase Id is required" });
    }

    const purchase = await purchaseModel.findById(purchaseId);
    if (!purchase) {
      return res
        .status(404)
        .json({ error: `Purchase not found with ID: ${purchaseId}` });
    }

    const supplier = await supplierModel.findById(purchase?.supplier);

    supplier.totalPurchaseDue =
      Number(supplier.totalPurchaseDue) -
      (Number(purchase?.totalPurchaseAmount || 0) -
        Number(purchase?.payments?.amount || 0));

    await deleteFileFromCloudinary(purchase.attachDocument);
    const deletePurchase = await purchaseModel.findByIdAndDelete(purchaseId);

    await PurchaseReportModel.deleteOne({ purchase: deletePurchase?._id });

    await supplier.save();

    return res.status(200).json({
      result: deletePurchase,
      message: "Purchase Deleted Successfully",
    });
  } catch (error) {
    console.log("error = ", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
