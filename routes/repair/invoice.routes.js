import express from "express"
import invoiceController from "../../controllers/repair/invoice.controller.js"
import multer from "multer" 
const router=express.Router()
const uploads=multer()

router.post("/addInvoice",uploads.any(),invoiceController.addInvoice)
      .get("/getAllInvoice",invoiceController.getAllInvoice)
      .get("/getInvoice/:id",invoiceController.getInvoiceById)
      .patch("/updateInvoice/:id",invoiceController.updateInvoiceById)
      .delete("/deleteInvoice/:id",invoiceController.deleteInvoiceById)


export default router
