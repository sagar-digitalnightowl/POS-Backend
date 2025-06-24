import express from 'express'
import multer from 'multer'
import quotationController from '../../controllers/sell/quotation.controller.js'
import { upload } from '../../middlewares/multer.middleware.js'

const uploads = multer()

const router = express.Router()

router.post("/addquotation",
      upload.fields([
            { name: "attachDocument", maxCount: 1 },
            { name: "shippingDocuments", maxCount: 1 },
      ]),
      quotationController.addquotation)
      .get("/getAllQuotation", quotationController.getAllQuotation)
      .get("/getQuotation/:id", quotationController.getQuotationById)
      .patch("/updateQuotation/:id",
            upload.fields([
                  { name: "attachDocument", maxCount: 1 },
                  { name: "shippingDocuments", maxCount: 1 },
            ]),
            quotationController.updateQuotationById)
      .delete("/deleteQuotation/:id", quotationController.deleteQuotationById)


export default router;