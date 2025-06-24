import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";
import purchaseReturnModel from "../../models/purchase/purchaseReturn.model.js";
import supplierModel from "../../models/contacts/customersAndSupplier.model.js";

const routes = {};

routes.addPurchaseReturn = async (req, res) => {
  try {
    const {
      products,
      additionalExpenses,
      discountType,
      discountAmount,
      additionalShippingcharges,
      purchaseReturnDate,
      purchaseReturnStatus,
    } = req.body;

    if (!purchaseReturnDate || !purchaseReturnStatus) {
      return res.status(400).json({ error: "Fill all mandatory fields" });
    }

    const supplier = await supplierModel.findById(req.body.supplier);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    const uploadedDocuments = await handleFilesUpload(
      req.files,
      "PurchaseReturn"
    );

    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedAdditionalExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];

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

    const totalPurchaseReturnAmount =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(additionalShippingcharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    // Create the PurchaseReturn object
    const newPurchaseReturn = new purchaseReturnModel({
      ...req.body,
      totalPurchaseReturnAmount,
      attachDocument: uploadedDocuments?.attachDocument,
      products: parsedProducts,
      additionalExpenses: parsedAdditionalExpenses,
    });

    // Save the new purchase return to the database
    await newPurchaseReturn.save();

    supplier.totalPurchaseReturnDue = (
      Number(supplier.totalPurchaseReturnDue || 0) + totalPurchaseReturnAmount
    ).toFixed(2);

    await supplier.save();

    // Send success response
    res.status(201).json({
      message: "Purchase return added successfully",
      result: newPurchaseReturn,
    });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllPurchaseReturn = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await purchaseReturnModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const purchaseReturn = await purchaseReturnModel
      .find()
      .populate("supplier")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!purchaseReturn || purchaseReturn.length === 0) {
      return res.status(404).json({ message: "No purchases found" });
    }

    return res.status(200).json({
      result: purchaseReturn,
      totalPage,
      message: "Purchase return retrieved successfully",
    });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getPurchaseReturnById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      return res.status(400).json({ error: "Purchase Id is required" });
    }

    const purchaseReturn = await purchaseReturnModel
      .findById(purchaseId)
      .populate("supplier");

    if (!purchaseReturn) {
      return res
        .status(400)
        .json({ error: `Purchase return is not found with Id ${purchaseId}` });
    }
    return res.status(200).json({
      result: purchaseReturn,
      message: "Purchase Return Retrieved Successfully",
    });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updatePurchaseReturnById = async (req, res) => {
  try {
    const purchaseReturnId = req.params.id;
    const updateData = req.body;

    if (!purchaseReturnId)
      return res.status(400).json({ error: "Purchase return Id is required" });

    const purchaseReturn = await purchaseReturnModel.findById(purchaseReturnId);

    if (!purchaseReturn)
      return res.status(404).json({
        error: `Purchase return not found with id:${purchaseReturnId}`,
      });

    const supplier = await supplierModel.findById(purchaseReturn?.supplier);

    let supplierPurchaseReturnDues = supplier.totalPurchaseReturnDue;

    supplierPurchaseReturnDues -= Number(
      purchaseReturn?.totalPurchaseReturnAmount || 0
    );

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          purchaseReturn,
          "PurchaseReturn"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const {
      products,
      additionalExpenses,
      discountType,
      discountAmount,
      additionalShippingcharges,
    } = req.body;

    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedAdditionalExpenses = additionalExpenses
      ? JSON.parse(additionalExpenses)
      : [];

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

    const totalPurchaseReturnAmount =
      Number(allProductsAmount || 0) -
      Number(totalDiscountAmount || 0) +
      Number(additionalShippingcharges || 0) +
      Number(allAdditionalExpenseAmount || 0);

    supplier.totalPurchaseReturnDue = (
      supplierPurchaseReturnDues + totalPurchaseReturnAmount
    ).toFixed(2);

    const updatedPurchaseReturn = await purchaseReturnModel.findByIdAndUpdate(
      purchaseReturnId,
      {
        ...updateData,
        totalPurchaseReturnAmount,
        products: parsedProducts,
        additionalExpenses: parsedAdditionalExpenses,
      },
      { new: true }
    );

    await supplier.save();

    return res.status(200).json({
      result: updatedPurchaseReturn,
      message: "Purchase return Updated Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deletePurchaseReturnById = async (req, res) => {
  try {
    const purchaseReturnId = req.params.id;
    if (!purchaseReturnId)
      return res.status(400).json({ error: "Purchase return Id is required" });

    const purchaseReturn = await purchaseReturnModel.findById(purchaseReturnId);
    if (!purchaseReturn) {
      return res.status(404).json({
        error: `Purchase return not fount with ID : ${purchaseReturnId}`,
      });
    }

    const supplier = await supplierModel.findById(purchaseReturn?.supplier);
    supplier.totalPurchaseReturnDue =
      Number(supplier.totalPurchaseReturnDue || 0) -
      Number(purchaseReturn.totalPurchaseReturnAmount || 0);

    await deleteFileFromCloudinary(purchaseReturn.attachDocument);

    const deletePurchaseReturn = await purchaseReturnModel.findByIdAndDelete(
      purchaseReturnId
    );
    await supplier.save();

    return res.status(200).json({
      result: deletePurchaseReturn,
      message: "Purchase Deleted Successfully",
    });
  } catch (error) {
    console.log("error =", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export default routes;
