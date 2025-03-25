import express from 'express'
import multer from 'multer'
import quotationController from '../../controllers/sell/quotation.controller.js'

const uploads =multer()

const router =express.Router()

router.post("/addquotation",uploads.any(),quotationController.addquotation)
      .get("/getAllQuotation",quotationController.getAllQuotation)
      .get("/getQuotation/:id",quotationController.getQuotationById)
      .patch("/updateQuotation/:id",quotationController.updateQuotationById)
      .delete("/deleteQuotation/:id",quotationController.deleteQuotationById)


export default router;