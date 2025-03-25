import express from 'express'
import stockAdjustmentController from '../../controllers/stockAdjustment/stockAdjustment.controller.js'

const router=express.Router();

router.post('/addStockAdjustment',stockAdjustmentController.addStockAdjustment)
      .get("/getAllStockAdjustment",stockAdjustmentController.getAllStockAdjustment)
      .get("/getStockAdjustment/:id",stockAdjustmentController.getStockAdjustmentById)
      .patch("/updateStockAdjustment/:id",stockAdjustmentController.updateStockAdjustmentById)
      .delete("/deleteStockAdjustment/:id",stockAdjustmentController.deleteStockAdjustmentById)
      
export default router;