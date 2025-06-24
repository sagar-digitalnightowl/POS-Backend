import express from "express";
import holidayController from "../../controllers/HRM/holiday.controller.js";

const router = express.Router();

router
  .post("/addHoliday", holidayController.createHoliday)
  .get("/getAllHolidays", holidayController.getAllHolidays)
  .get("/getHolidayById/:id", holidayController.getHolidayById)
  .patch("/updateHoliday/:id", holidayController.updateHoliday)
  .delete("/deleteHoliday/:id", holidayController.deleteHoliday);

export default router;
