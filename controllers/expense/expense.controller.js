import expenseModel from "../../models/expense/expense.model.js";
import productModel from "../../models/products/productList.model.js";
import expenseCategoryModel from "../../models/expense/expenseCategory.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addExpense = async (req, res) => {
  try {
    const { expenseCategory, recurringinterval, payment } = req.body;

    const categoryExpense = await expenseCategoryModel.findById(
      expenseCategory
    );
    if (!categoryExpense) {
      return res.status(404).json({ error: "Expense Category not found" });
    }

    const uploadFile = await handleFilesUpload(req.files, "Expense");

    const parsedRecurringinterval = recurringinterval
      ? JSON.parse(recurringinterval)
      : {};
    const parsedPayment = payment ? JSON.parse(payment) : {};

    const newExpense = new expenseModel({
      ...req.body,
      attachDocument: uploadFile.attachDocument,
      recurringinterval: parsedRecurringinterval,
      payment: parsedPayment,
    });

    await newExpense.save();

    return res
      .status(201)
      .json({ result: newExpense, message: "Expense Added Successfully" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllExpense = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await expenseModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allExpense = await expenseModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("expenseCategory");

    if (!allExpense || !allExpense === 0) {
      return res.status(404).json({ error: "No Expense Found" });
    }
    return res.status(200).json({
      result: allExpense,
      totalPage,
      message: "All Expense Fetched Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getExpenseById = async (req, res) => {
  try {
    const expenseId = req.params.id;
    if (!expenseId) {
      return res.status(404).json({ error: "Expense Id is required" });
    }
    const expense = await expenseModel.findById(expenseId);

    if (!expense) {
      return res
        .status(404)
        .json({ error: `Expense is not found with Id ${expenseId}` });
    }
    return res
      .status(200)
      .json({ result: expense, message: "Wxpense data is fetched" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.updateExpenseId = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const updateData = req.body;

    if (!expenseId) {
      return res.status(404).json({ error: "Expense Id is required" });
    }

    const existExpense = await expenseModel.findById(expenseId);
    if (!existExpense) {
      return res
        .status(404)
        .json({ error: `Expense is not found with Id ${expenseId}` });
    }

    const categoryExpense = await expenseCategoryModel.findById(
      updateData?.expenseCategory
    );
    if (!categoryExpense) {
      return res.status(404).json({ error: "Expense Category not found" });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existExpense,
          "Expense"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const parsedRecurringinterval = updateData?.recurringinterval
      ? JSON.parse(updateData?.recurringinterval)
      : {};
    const parsedPayment = updateData?.payment ? JSON.parse(updateData?.payment) : {};

    const expense = await expenseModel.findByIdAndUpdate(
      expenseId,
      {
        ...updateData,
        recurringinterval: parsedRecurringinterval,
        payment: parsedPayment
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ result: expense, message: "Expense updated successfully" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.deleteExpenseId = async (req, res) => {
  try {
    const expenseId = req.params.id;
    if (!expenseId) {
      return res.status(404).json({ error: "Expense Id is required" });
    }
    const expense = await expenseModel.findByIdAndDelete(expenseId);

    if (!expense) {
      return res
        .status(404)
        .json({ error: `Expense is not found with Id ${expenseId}` });
    }

    await deleteFileFromCloudinary(expense?.attachDocument);

    return res
      .status(200)
      .json({ result: expense, message: "Expense is deleted successfully" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

export default routes;
