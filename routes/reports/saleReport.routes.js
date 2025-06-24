import express from "express";
import saleReportController from "../../controllers/reports/saleReport.controller.js";

const router = express.Router();

router
  .get("/getAllSaleReports", saleReportController.getAllSaleReports)
  .get("/saleReport/:id", saleReportController.getSaleReportById);

export default router;
