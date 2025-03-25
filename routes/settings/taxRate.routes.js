import taxRateController from '../../controllers/settings/taxRate.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addTaxRate',taxRateController.addTaxRate)
      .get('/getAllTaxRate',taxRateController.getAllTaxRate)
      .get('/getTaxRate/:id',taxRateController.getTaxRateById)
      .patch('/updateTaxRate/:id',taxRateController.updateTaxRateById)
      .delete('/deleteTaxRate/:id',taxRateController.deleteTaxRateById)

export default router;