import express from "express";
import purchaseController from "../../controllers/purchase/purchase.controller.js";
import { upload } from '../../middlewares/multer.middleware.js'


const router=express.Router();


router.post("/addPurchase",upload.single('attachDocument'), purchaseController.addPurchase)
      .get("/getAllPurchase",purchaseController.getAllPurchase)
      .get("/getPurchase/:id",purchaseController.getPurchaseById)
      .patch("/updatePurchase/:id",purchaseController.updatePurchaseById)
      .delete("/deletePurchase/:id",purchaseController.deletePurchaseById)

export default router;