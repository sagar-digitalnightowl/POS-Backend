import express from 'express'
import invoiceSchemeController from '../../controllers/settings/invoiceScheme.controller.js'

const router =express.Router()


router.post("/addInvoiceScheme",invoiceSchemeController.addInvoiceScheme)
      .get("/getAllInvoiceScheme",invoiceSchemeController.getAllInvoiceScheme)
      .get("/getInvoiceScheme/:id",invoiceSchemeController.getInvoiceSchemeById)
      .patch("/updateInvoiceScheme/:id",invoiceSchemeController.updateInvoiceSchemeById)
      .delete("/deleteInvoiceScheme/:id",invoiceSchemeController.deleteInvoiceSchemeById)

export default router;