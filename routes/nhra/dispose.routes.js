import express from "express";
import disposeController from "../../controllers/nhra/dispose.controller.js";
import multer from "multer";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addDispose",
    upload.fields([
      { name: "supremeCouncilOfEnvironmentApproval", maxCount: 1 },
      { name: "airwayBill", maxCount: 1 },
      { name: "destructionInvoice", maxCount: 1 },
    ]),
    disposeController.addDispose
  )
  .get("/getAllDispose", disposeController.getAllDispose)
  .get("/getDispose/:id", disposeController.getDisposeById)
  .patch(
    "/updateDispose/:id",
    upload.fields([
      { name: "supremeCouncilOfEnvironmentApproval", maxCount: 1 },
      { name: "airwayBill", maxCount: 1 },
      { name: "destructionInvoice", maxCount: 1 },
    ]),
    disposeController.updateDisposeById
  )
  .delete("/deleteDispose/:id", disposeController.deleteDisposeById);

export default router;
