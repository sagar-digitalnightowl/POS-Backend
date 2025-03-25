import salesTargetController from '../../controllers/HRM/salesTarget.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addSalesTarget',salesTargetController.addSalesTarget)
      .get('/getAllSalesTarget',salesTargetController.getAllSalesTarget)
      .get('/getSalesTarget/:id',salesTargetController.getSalesTargetById)
      .patch('/updateSalesTarget/:id',salesTargetController.updateSalesTargetById)
      .delete('/deleteSalesTarget/:id',salesTargetController.deleteSalesTargetById)

export default router