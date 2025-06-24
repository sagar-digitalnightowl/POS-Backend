import LeaveTypeModel from "../../models/HRM/leaveType.model.js";
import LeaveModel from "../../models/HRM/leave.model.js";
import EmployeeLeaveBalanceModel from "../../models/HRM/employeeLeaveBalance.model.js";
import UserModel from "../../models/userManagement/user.model.js";
import { calculateLeaveDays } from "../../utils/helperFunctions.js";

const routes = {};

routes.createLeave = async (req, res) => {
  try {
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    if (!employee || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        error: "Fill all the mandatory fields",
      });
    }

    const existEmployee = await UserModel.findById(employee);
    if (!existEmployee) {
      return res.status(404).json({
        error: `Employee not found with id : ${employee}`,
      });
    }

    const employeeLeaveBalance =
      await EmployeeLeaveBalanceModel.findOneAndUpdate(
        { employee, leaveType },
        { $setOnInsert: { employee, leaveType } },
        { new: true, upsert: true }
      ).populate("leaveType");

    if (
      employeeLeaveBalance?.usedLeaves >=
      employeeLeaveBalance?.leaveType?.maxLeaveCount
    ) {
      return res.status(404).json({
        error: `This employee has no leaves of ${employeeLeaveBalance?.leaveType?.leaveType} type`,
      });
    }

    const leaveDays = calculateLeaveDays(startDate, endDate);

    if (
      employeeLeaveBalance?.leaveType?.maxLeaveCount -
        employeeLeaveBalance?.usedLeaves <
      leaveDays
    ) {
      return res.status(400).json({
        error: `This employee has only ${
          employeeLeaveBalance?.leaveType?.maxLeaveCount -
          employeeLeaveBalance?.usedLeaves
        } leaves left of ${employeeLeaveBalance?.leaveType?.leaveType} type`,
      });
    }

    const newLeave = await LeaveModel.create({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    employeeLeaveBalance.usedLeaves += leaveDays;
    await employeeLeaveBalance.save();

    return res.status(201).json({
      result: newLeave,
      message: "New Leave added Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await LeaveModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    const allLeaves = await LeaveModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employee")
      .populate("leaveType");

    return res.status(200).json({
      result: allLeaves,
      totalPage,
      message: "All Leaves fetched successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getLeaveById = async (req, res) => {
  try {
    const leaveId = req.params.id;

    if (!leaveId) {
      return res.status(400).json({
        error: "Leave ID is required",
      });
    }

    const leave = await LeaveModel.findById(leaveId)
      .populate("employee")
      .populate("leaveType");

    if (!leave) {
      return res.status(404).json({
        error: `No leave found with id : ${leaveId}`,
      });
    }

    return res.status(200).json({
      result: leave,
      message: "Leave fetch Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllLeavesOfEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await LeaveModel.countDocuments({
      employee: employeeId,
    });
    const totalPage = Math.ceil(totalCount / limit);

    if (!employeeId) {
      return res.status(400).json({
        error: "Employee id is required",
      });
    }

    const allLeaves = await LeaveModel.find({ employee: employeeId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employee")
      .populate("leaveType");

    return res.status(200).json({
      result: allLeaves,
      totalPage,
      message: "Employee all leaves fetch Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.updateLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    if (!employee || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        error: "Fill all the mandatory fields",
      });
    }

    if (!leaveId) {
      return res.status(400).json({
        error: "Leave id is required",
      });
    }

    const existLeave = await LeaveModel.findById(leaveId);

    if (!existLeave) {
      return res.status(404).json({
        error: `Leave not found with id : ${leaveId}`,
      });
    }

    const existEmployee = await UserModel.findById(employee);
    if (!existEmployee) {
      return res.status(404).json({
        error: `Employee not found with id : ${employee}`,
      });
    }

    const employeeLeaveBalance =
      await EmployeeLeaveBalanceModel.findOneAndUpdate(
        { employee, leaveType },
        { $setOnInsert: { employee, leaveType } },
        { new: true, upsert: true }
      ).populate("leaveType");

    if (!employeeLeaveBalance) {
      return res.status(404).json({
        error: `Incorrect employee or leave type id`,
      });
    }
    // Revert previous leave days
    employeeLeaveBalance.usedLeaves -= calculateLeaveDays(
      existLeave?.startDate,
      existLeave.endDate
    );

    if (
      employeeLeaveBalance?.usedLeaves >=
      employeeLeaveBalance?.leaveType?.maxLeaveCount
    ) {
      return res.status(400).json({
        error: `This employee has no leaves of ${employeeLeaveBalance?.leaveType?.leaveType} type`,
      });
    }

    const leaveDays = calculateLeaveDays(startDate, endDate);

    if (
      employeeLeaveBalance?.leaveType?.maxLeaveCount -
        employeeLeaveBalance?.usedLeaves <
      leaveDays
    ) {
      return res.status(400).json({
        error: `This employee has only ${
          employeeLeaveBalance?.leaveType?.maxLeaveCount -
          employeeLeaveBalance?.usedLeaves
        } leaves left of ${employeeLeaveBalance?.leaveType?.leaveType} type`,
      });
    }

    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      leaveId,
      {
        leaveType,
        startDate,
        endDate,
        reason,
      },
      { new: true }
    );

    employeeLeaveBalance.usedLeaves += leaveDays;
    employeeLeaveBalance.save();

    return res.status(200).json({
      result: updatedLeave,
      message: "Leave Update Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    if (!leaveId) {
      return res.status(400).json({
        error: "Leave id is required",
      });
    }

    const deletedLeave = await LeaveModel.findByIdAndDelete(leaveId);

    if (!deletedLeave) {
      return res.status(404).json({
        error: `Leave not found with id : ${leaveId}`,
      });
    }

    return res.status(200).json({
      result: deletedLeave,
      message: "Leave delete Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

export default routes;
