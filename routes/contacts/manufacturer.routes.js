import express from "express"
import manufacturerController from "../../controllers/contacts/manufacturer.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";


const router=express.Router();

router.post(
      "/addManufacturer",
      upload.any(),
      manufacturerController.addManufacturer
    )
      .get("/getAllManufacturer",manufacturerController.getAllManufacturer)
      .get("/getManufacturer/:id",manufacturerController.getManufacturerById)
      .patch("/updateManufacturer/:id", upload.any(),manufacturerController.updateManufacturerById)
      .delete("/deleteManufacturer/:id",manufacturerController.deleteManufacturerById)

      export default router