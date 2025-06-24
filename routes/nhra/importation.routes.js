import express from "express";
import importationController from "../../controllers/nhra/importation.controller.js";
import multer from "multer";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addImportation",
    upload.fields([
      { name: "invoice", maxCount: 1 },
      { name: "purchaseOrder", maxCount: 1 },
      { name: "catalogue", maxCount: 1 },
      { name: "freeSaleCertificate", maxCount: 1 },
      { name: "qualityAssuranceCertificate", maxCount: 1 },
    ]),
    importationController.addImportation
  )
  .get("/getAllImportation", importationController.getAllImportation)
  .get("/getImportation/:id", importationController.getImportationById)
  .patch(
    "/updateImportation/:id",
    upload.fields([
      { name: "invoice", maxCount: 1 },
      { name: "purchaseOrder", maxCount: 1 },
      { name: "catalogue", maxCount: 1 },
      { name: "freeSaleCertificate", maxCount: 1 },
      { name: "qualityAssuranceCertificate", maxCount: 1 },
    ]),
    importationController.updateImportationById
  )
  .delete(
    "/deleteImportation/:id",
    importationController.deleteImportationById
  );

export default router;
