import expenseController from "../../controllers/expense/expense.controller.js";
import multer from "multer";
import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addExpense",
    upload.fields([{ name: "attachDocument", maxCount: 1 }]),
    expenseController.addExpense
  )
  .get("/getAllExpense", expenseController.getAllExpense)
  .get("/getExpense/:id", expenseController.getExpenseById)
  .patch(
    "/updateExpense/:id",
    upload.fields([{ name: "attachDocument", maxCount: 1 }]),
    expenseController.updateExpenseId
  )
  .delete("/deleteExpense/:id", expenseController.deleteExpenseId);

export default router;
