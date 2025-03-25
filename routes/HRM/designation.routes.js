import designationController from '../../controllers/HRM/designation.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addDesignation',designationController.addDesignation)
      .get('/getAllDesignation',designationController.getAllDesignation)
      .get('/getDesignation/:id',designationController.getDesignationById)
      .patch('/updateDesignation/:id',designationController.updateDesignationById)
      .delete('/deleteDesignation/:id',designationController.deleteDesignationById)

export default router;