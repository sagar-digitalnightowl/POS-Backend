import express from "express";
import purchaseReturnController from "../../controllers/purchase/purchase.return.controller.js";
import { upload } from "../../middlewares/multer.middleware.js"

const router=express.Router();

router.post("/addPurchaseReturn",upload.single("attachDocuments"),purchaseReturnController.addPurchaseReturn)
      .get("/getAllPurchaseReturn",purchaseReturnController.getAllPurchaseReturn)
      .get("/getAllPurchaseReturn/:id",purchaseReturnController.getAllPurchaseReturnById)
      .patch("/updatePurchaseReturn/:id",purchaseReturnController.updatePurchaseReturnById)
      .delete("/deletePurchase/:id",purchaseReturnController.deletePurchaseById)


export default router;