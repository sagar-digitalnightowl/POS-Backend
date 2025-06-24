import ShiftModel from "../../models/HRM/shift.model.js";

const routes = {};

routes.createShift = async (req, res) => {
  try {
    const existShift = await ShiftModel.findOne({ name: req?.body?.name });

    if (existShift) {
      return res.status(400).json({
        error: `Shift name '${req?.name}' already exist`,
      });
    }

    const newShift = new ShiftModel({
      ...req.body,
    });

    await newShift.save();

    return res.status(201).json({
      result: newShift,
      message: "Shift created successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllShift = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await ShiftModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    const allShifts = await ShiftModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      result: allShifts,
      totalPage,
      message: "All shifts fetch successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getShiftById = async (req, res) => {
  try {
    const shiftId = req.params.id;

    if (!shiftId) {
      return res.status(400).json({
        error: "Shift id is required",
      });
    }
    const shift = await ShiftModel.findById(shiftId);

    if (!shift) {
      return res.status(404).json({
        error: `Shift not found with id : ${shiftId}`,
      });
    }

    return res.status(200).json({
      result: shift,
      message: "Shift fetch successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.updateShift = async (req, res) => {
  try {
    const shiftId = req.params.id;

    if (!shiftId) {
      return res.status(400).json({
        error: "Shift id is required",
      });
    }

    const existShift = await ShiftModel.findOne({ name: req?.body?.name });

    if (existShift) {
      return res.status(400).json({
        error: `Shift name '${req?.name}' already exist`,
      });
    }

    const updatedShift = await ShiftModel.findByIdAndUpdate(
      shiftId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedShift) {
      return res.status(404).json({
        error: `Shift not found with id : ${shiftId}`,
      });
    }

    return res.status(200).json({
      result: updatedShift,
      message: "Update Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.deleteShift = async (req, res) => {
  try {
    const shiftId = req.params.id;

    if (!shiftId) {
      return res.status(400).json({
        error: "Shift id is required",
      });
    }

    const deletedShift = await ShiftModel.findByIdAndDelete(shiftId);

    if (!deletedShift) {
      return res.status(404).json({
        error: `Shift not found with id : ${shiftId}`,
      });
    }

    return res.status(200).json({
      result: deletedShift,
      message: "delete Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

export default routes;
