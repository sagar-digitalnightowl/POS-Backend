import salesTargetModel from "../../models/HRM/salesTarget.model.js";
import employeeModel from "../../models/userManagement/user.model.js";

const routes = {};

routes.addSalesTarget = async (req, res) => {
  try {
    const {
      employee,
      totalSalesAmountFrom,
      totalSalesAmountTo,
      commissionPercentage,
    } = req.body;

    const existEmployee = await employeeModel.findById(employee);

    if (!existEmployee) {
      return res.status(404).json({
        error: `Employee not found with id : ${employee}`,
      });
    }

    const newSalesTarget = new salesTargetModel({
      employee,
      totalSalesAmountFrom,
      totalSalesAmountTo,
      commissionPercentage,
    });
    await newSalesTarget.save();

    res.status(201).json({
      result: newSalesTarget,
      message: "Sales target added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllSalesTarget = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await salesTargetModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    const allTarget = await salesTargetModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('employee');

    if (!allTarget || allTarget === 0) {
      return res.status(400).json({ error: "No Sales Target is found" });
    }
    return res.status(200).json({
      result: allTarget,
      totalPage,
      message: "Sales Target fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getSalesTargetById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is require" });
    }

    const target = await salesTargetModel.findById(id);
    if (!target) {
      return res
        .status(404)
        .json({ error: `Target is not found with Id ${id}` });
    }
    return res
      .status(200)
      .json({ result: target, message: "Target fetch Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updateSalesTargetById = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) {
      return res.status(400).json({ error: "Id is require" });
    }

    const target = await salesTargetModel.findByIdAndUpdate(
      targetId,
      req.body,
      { new: true }
    );
    if (!target) {
      return res
        .status(404)
        .json({ error: `Target is not found with Id ${targetId}` });
    }
    return res
      .status(200)
      .json({ result: target, message: "Target fetch Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.deleteSalesTargetById = async (req, res) => {
  try {
    const id = req.params.id;
    const target = await salesTargetModel.findByIdAndDelete(id);
    if (!target)
      return res
        .status(404)
        .json({ error: `Target is not found with Id ${id}` });
    return res
      .status(200)
      .json({ result: target, message: "Target deleted successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
export default routes;
