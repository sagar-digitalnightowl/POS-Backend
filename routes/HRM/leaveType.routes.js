import leaveTypeController from '../../controllers/HRM/leaveType.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addLeaveType',leaveTypeController.addLeaveType)
      .get('/getAllLeaveType',leaveTypeController.getAllLeaveType)
      .get('/getLeaveTypes',leaveTypeController.getLeaveTypes)
      .get('/getLeaveType/:id',leaveTypeController.getLeaveTypeById)
      .patch('/updateLeaveType/:id',leaveTypeController.updateLeaveTypeById)
      .delete('/deleteLeaveType/:id',leaveTypeController.deleteLeaveTypeById)

export default router;