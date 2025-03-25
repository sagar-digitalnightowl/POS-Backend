import printerController from '../../controllers/settings/printer.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addPrinter',printerController.addPrinter)
      .get('/getAllPrinter',printerController.getAllPrinter)
      .get('/getPrinter/:id',printerController.getPrinterById)
      .patch('/updatePrinter/:id',printerController.updatePrinterById)
      .delete('/deletePrinter/:id',printerController.deletePrinterById)

export default router;