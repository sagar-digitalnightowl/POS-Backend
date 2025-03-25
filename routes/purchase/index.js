import express from "express"
import purchaseRoutes from "./purchase.routes.js"
import purchaseReturnRoutes from "./purchase.return.routes.js"


const router = express.Router();

router
  .use("/purchaseList", purchaseRoutes)
  .use("/purchaseReturn", purchaseReturnRoutes)

export default router;