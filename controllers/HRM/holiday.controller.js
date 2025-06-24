import { result } from "ttr";
import HolidayModel from "../../models/HRM/holiday.model.js";

const routes = {};

routes.createHoliday = async (req, res) => {
  try {
    const { name } = req.body;

    const existHoliday = await HolidayModel.findOne({ name });

    if (existHoliday) {
      return res.status(400).json({
        error: `A holiday already exist with name : ${name}`,
      });
    }

    const newHoliday = new HolidayModel({ ...req.body });
    await newHoliday.save();

    return res.status(201).json({
      result: newHoliday,
      message: "Holiday create Successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllHolidays = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalCount = await HolidayModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    const allHolidays = await HolidayModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      result: allHolidays,
      totalPage,
      message: "Fetch all holidays successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getHolidayById = async (req, res) => {
  try {
    const holidayId = req.params.id;

    if (!holidayId) {
      return res.status(400).json({
        error: "Holiday id is required",
      });
    }

    const holiday = await HolidayModel.findById(holidayId);

    if (!holiday) {
      return res.status(404).json({
        error: `Holiday not found with id : ${holidayId}`,
      });
    }

    return res.status(200).json({
      result: holiday,
      message: "Holiday fetch successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.updateHoliday = async (req, res) => {
  try {
    const holidayId = req.params.id;

    if (!holidayId) {
      return res.status(400).json({
        error: "Holiday id is required",
      });
    }

    const updatedHoliday = await HolidayModel.findByIdAndUpdate(
      holidayId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedHoliday) {
      return res.status(404).json({
        error: `Holiday not found with id : ${holidayId}`,
      });
    }

    return res.status(200).json({
      result: updatedHoliday,
      message: "Holiday update successfully",
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.deleteHoliday = async (req, res) => {
  try {
    const holidayId = req.params.id;

    if (!holidayId) {
      return res.status(400).json({
        error: "Holiday id is required",
      });
    }

    const deletedHoliday = await HolidayModel.findByIdAndDelete(holidayId);

    if(!deletedHoliday){
        return res.status(404).json({
            error: `Holiday not found with id : ${holidayId}`
        })
    }

    return res.status(200).json({
        result: deletedHoliday,
        message: "Holiday delete successfully"
    })
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};


export default routes;