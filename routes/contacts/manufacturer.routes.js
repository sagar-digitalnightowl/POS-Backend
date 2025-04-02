import express from "express"
import manufacturerController from "../../controllers/contacts/manufacturer.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";


const router=express.Router();

router.post(
      "/addManufacturer",
      upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'letter', maxCount: 1 }
      ]),
      manufacturerController.addManufacturer
    )
      .get("/getAllManufacturer",manufacturerController.getAllManufacturer)
      .get("/getManufacturer/:id",manufacturerController.getManufacturerById)
      .patch("/updateManufacturer/:id",upload.fields([{ name: 'profilePhoto', maxCount: 1 },{ name: 'letter', maxCount: 1 }]),manufacturerController.updateManufacturerById)
      .delete("/deleteManufacturer/:id",manufacturerController.deleteManufacturerById)

      export default router