import express from "express";
import shiftController from "../../controllers/HRM/shift.controller.js";

const router = express.Router();

router
  .post("/addShift", shiftController.createShift)
  .get("/getAllShift", shiftController.getAllShift)
  .get("/getShiftById", shiftController.getShiftById)
  .patch("/updateShift/:id", shiftController.updateShift)
  .delete("/deleteShift/:id", shiftController.deleteShift);

export default router;
