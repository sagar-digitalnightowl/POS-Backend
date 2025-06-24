import alert_ModificationController from "../../controllers/nhra/alert_Modification.controller.js";
import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addAlertModification",
    upload.fields([{ name: "modificationDocument", maxCount: 1 }]),
    alert_ModificationController.addAlert_Modification
  )
  .get(
    "/getAllAlertModification",
    alert_ModificationController.getAllAlert_Modification
  )
  .get(
    "/getAlertModification/:id",
    alert_ModificationController.getAlert_ModificationById
  )
  .patch(
    "/updateAlertModification/:id",
    upload.fields([{ name: "modificationDocument", maxCount: 1 }]),
    alert_ModificationController.updateAlert_ModificationById
  )
  .delete(
    "/deleteAlertModification/:id",
    alert_ModificationController.deleteAlert_ModificationById
  );

export default router;
