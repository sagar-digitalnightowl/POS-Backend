import express from 'express'
import stockTransferController from '../../controllers/stockTransfer/stockTransfer.controller.js'

const router=express.Router();

router.post('/addStockTransfer',stockTransferController.addStockTransfer)
      .get("/getAllStockTransfer",stockTransferController.getAllStockTransfer)
      .get("/getStockTransfer/:id",stockTransferController.getStockTransferById)
      .patch("/updateStockTransfer/:id",stockTransferController.updateStockTransferById)
      .delete("/deleteStockTransfer/:id",stockTransferController.deleteStockTransferById)
      
      
      export default router;