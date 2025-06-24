import express from "express";
import purchaseReportController from "../../controllers/reports/purchaseReport.controller.js";

const router = express.Router();

router
  .get("/getAllPurchaseReport", purchaseReportController.getAllPurchaseReport)
  .get("/purchaseReport/:id", purchaseReportController.getPurchaseReportById);


export default router;