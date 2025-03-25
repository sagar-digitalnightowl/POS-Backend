import allInvoiceLayoutController from '../../controllers/settings/allInvoiceLayout.controller.js'
import express from 'express'
import multer from 'multer'

const upload=multer()

const router=express.Router();

router.post('/addAllInvoiceLayout',upload.single('invoiceLogo'),allInvoiceLayoutController.addAllInvoiceLayout)
      .get("/getAllInvoiceLayout",allInvoiceLayoutController.getAllInvoiceLayout)
      .get("/getInvoiceLayout/:id",allInvoiceLayoutController.getInvoiceLayoutById)
      .patch("/updateInvoiceLayout/:id",allInvoiceLayoutController.updateInvoiceLayoutById)
      .delete("/deleteInvoiceLayout/:id",allInvoiceLayoutController.deleteInvoiceLayoutById)


export default router;