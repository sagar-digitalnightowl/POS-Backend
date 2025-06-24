import express from 'express'
import leaveController from '../../controllers/HRM/leave.controller.js'

const router = express.Router();


router.post("/addLeave", leaveController.createLeave)
.get("/getAllLeaves", leaveController.getAllLeaves)
.get("/getLeaveById/:id", leaveController.getLeaveById)
.get("/getAllLeaveOfEmployee/:id", leaveController.getAllLeavesOfEmployee)
.patch("/updateLeave/:id", leaveController.updateLeave)
.delete("/deleteLeave/:id", leaveController.deleteLeave)


export default router;