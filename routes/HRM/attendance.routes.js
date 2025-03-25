import attendanceController from "../../controllers/HRM/attendance.controller.js";
import express from 'express'

const router = express.Router()

router.post('/addAttendance',attendanceController.addAttendance)
      .get('/getAllAttendance',attendanceController.getAllAttendance)
      .get('/getAttendance/:id',attendanceController.getAttendanceById)
      .patch('/updateAttendance/:id',attendanceController.updateAttendanceById)
      .delete('/deleteAttendance/:id',attendanceController.deleteAttendanceById)
        
export default router;