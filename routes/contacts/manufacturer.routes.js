import express from "express"
import manufacturerController from "../../controllers/contacts/manufacturer.controller.js";
const router=express.Router();

router.post("/addManufacturer",manufacturerController.addManufacturer)
      .get("/getAllManufacturer",manufacturerController.getAllManufacturer)
      .get("/getManufacturer/:id",manufacturerController.getManufacturerById)
      .patch("/updateManufacturer/:id",manufacturerController.updateManufacturerById)
      .delete("/deleteManufacturer/:id",manufacturerController.deleteManufacturerById)

      export default router