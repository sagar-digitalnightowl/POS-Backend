import express from "express";

import purchaseReportRoutes from "./purchaseReport.routes.js";
import saleReportRoutes from "./saleReport.routes.js";

const router = express.Router();

router
  .use("/purchaseReport", purchaseReportRoutes)
  .use("/saleReport", saleReportRoutes);

export default router;
