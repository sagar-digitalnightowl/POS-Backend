import express from "express";
import purchaseReturnController from "../../controllers/purchase/purchase.return.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addPurchaseReturn",
    upload.fields([{ name: "attachDocument", maxCount: 1 }]),
    purchaseReturnController.addPurchaseReturn
  )
  .get("/getAllPurchaseReturn", purchaseReturnController.getAllPurchaseReturn)
  .get(
    "/getPurchaseReturn/:id",
    purchaseReturnController.getPurchaseReturnById
  )
  .patch(
    "/updatePurchaseReturn/:id",
    upload.fields([{ name: "attachDocument", maxCount: 1 }]),
    purchaseReturnController.updatePurchaseReturnById
  )
  .delete("/deletePurchase/:id", purchaseReturnController.deletePurchaseReturnById);

export default router;
