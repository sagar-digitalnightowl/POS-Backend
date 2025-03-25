import express from 'express'
import leaveTypeRoutes from './leaveType.routes.js'
import attendanceRoutes from './attendance.routes.js'
import departmentRoutes from './department.routes.js'
import designationRoutes from './designation.routes.js'
import salesTargetRoutes from './salesTarget.routes.js'

const router = express.Router()

router.use('/leaveType',leaveTypeRoutes)
      .use('/attendance',attendanceRoutes)
      .use('/department',departmentRoutes)
      .use('/designation',designationRoutes)
      .use('/salesTarget',salesTargetRoutes)

export default router