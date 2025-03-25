import taxGroupController from '../../controllers/settings/taxGroup.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addTaxGroup',taxGroupController.addTaxGroup)
      .get('/getAllTaxGroup',taxGroupController.getAllTaxGroup)
      .get('/getTaxGroup/:id',taxGroupController.getTaxGroupById)
      .patch('/updateTaxGroup/:id',taxGroupController.updateTaxGroupById)
      .delete('/deleteTaxGroup/:id',taxGroupController.deleteTaxGroupById)

export default router;