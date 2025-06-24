import express from "express";
import leaveTypeRoutes from "./leaveType.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import departmentRoutes from "./department.routes.js";
import designationRoutes from "./designation.routes.js";
import salesTargetRoutes from "./salesTarget.routes.js";
import leaveRoutes from "./leave.routes.js";
import employeeLeaveBalanceRoutes from "./employeeLeaveBalance.routes.js";
import holidayRoutes from "./holidays.routes.js";
import shiftRoutes from "./shift.routes.js";

const router = express.Router();

router
  .use("/leaveType", leaveTypeRoutes)
  .use("/attendance", attendanceRoutes)
  .use("/department", departmentRoutes)
  .use("/designation", designationRoutes)
  .use("/salesTarget", salesTargetRoutes)
  .use("/leaves", leaveRoutes)
  .use("/employeeLeaveBalance", employeeLeaveBalanceRoutes)
  .use("/holiday", holidayRoutes)
  .use("/shift", shiftRoutes);

export default router;
