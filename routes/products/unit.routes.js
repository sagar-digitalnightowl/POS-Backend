import express from "express";
import unitController from "../../controllers/products/unit.controller.js";

const router = express.Router();

router
  .post("/addUnit", unitController.addUnit)
  .get("/getAllUnits", unitController.getAllUnit)
  .get("/getUnits", unitController.getUnits)
  .get("/getUnit/:id", unitController.getUnitById)
  .patch("/updateUnit/:id", unitController.updateUnitById)
  .delete("/deleteUnit/:id", unitController.deleteUnitById);
  
export default router;
