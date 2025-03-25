import express from "express"
import invoiceController from "../../controllers/repair/invoice.controller.js"
import multer from "multer" 
const router=express.Router()
const uploads=multer()

router.post("/addInvoice",uploads.any(),invoiceController.addInvoice)
      .get("/getAllInvoice",invoiceController.getAllInvoice)
      .get("/getJobSheet/:id",invoiceController.getJobSheetById)
      .patch("/updateJobSheet/:id",invoiceController.updateJobSheetById)
      .delete("/deleteJobSheet/:id",invoiceController.deleteJobSheetById)


export default router
