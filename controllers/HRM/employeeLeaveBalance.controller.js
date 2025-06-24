import EmployeeLeaveBalanceModel from "../../models/HRM/employeeLeaveBalance.model.js";

const routes = {};

routes.getAllEmployeeLeaveBalance = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await EmployeeLeaveBalanceModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    const allEmployeeLeaveBalance = await EmployeeLeaveBalanceModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employee")
      .populate("leaveType");

    return res.status(200).json({
      result: allEmployeeLeaveBalance,
      totalPage,
      message: "All Employee leaves balance fetch successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getEmployeeLeaveBalanceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Employee leave balance id is required",
      });
    }

    const employeeLeaveBalance = await EmployeeLeaveBalanceModel.findById(id)
      .populate("employee")
      .populate("leaveType");

    if (!employeeLeaveBalance) {
      return res.status(404).json({
        error: `Employee Leave Balance not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      result: employeeLeaveBalance,
      message: "Employee Leave Balance fetch Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllEmployeeLeaveBalanceOfAnEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await EmployeeLeaveBalanceModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    if (!employeeId) {
      return res.status(400).json({
        error: "Employee id is required",
      });
    }

    const allDoc = await EmployeeLeaveBalanceModel.find({
      employee: employeeId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employee")
      .populate("leaveType");

    return res.status(200).json({
      result: allDoc,
      totalPage,
      message: "All Employee Leave Balance Of an Employee fetch successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};



export default routes;