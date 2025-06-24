import express from 'express'
import saleController from '../../controllers/sell/sale.controller.js'
import { upload } from '../../middlewares/multer.middleware.js'


const router = express.Router();

router.post("/addSales",
  upload.fields([
    { name: "attachDocument", maxCount: 1 },
    { name: "shippingDocuments", maxCount: 1 },
  ])
  , saleController.addSales)
  .get("/getAllSales", saleController.getAllSales)
  .get("/getSales", saleController.getSales)
  .get("/getSales/:id", saleController.getSaleById)
  .patch("/updateSales/:id", upload.fields([
    { name: "attachDocument", maxCount: 1 },
    { name: "shippingDocuments", maxCount: 1 },
  ]), saleController.updateSalesById)
  .delete("/deleteSales/:id", saleController.deleteSalesById)



export default router;