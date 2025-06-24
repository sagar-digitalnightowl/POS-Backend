import mongoose from "mongoose";

const employeeLeaveBalance = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    usedLeaves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const EmployeeLeaveBalance = mongoose.model(
  "EmployeeLeaveBalance",
  employeeLeaveBalance
);
export default EmployeeLeaveBalance;
