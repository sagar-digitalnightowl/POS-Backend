import safetyNoticeController from "../../controllers/nhra/safetyNotice.controller.js";
import multer from "multer";
import express from "express";

const upload = multer();

const router = express.Router();

router
  .post(
    "/addSafetyNotice",
    upload.fields([
      { name: "copyOfReport", maxCount: 1 },
      { name: "lpo", maxCount: 1 },
      { name: "importationHistory", maxCount: 1 },
      { name: "nhraMedicalDeviceRegistrationLicense", maxCount: 1 },
      { name: "returnInvoice", maxCount: 1 },
      { name: "destructionInvoice", maxCount: 1 },
      { name: "acknowledgment", maxCount: 1 },
      { name: "signature", maxCount: 1 },
      { name: "signatureDeclarationLetter", maxCount: 1 },
    ]),
    safetyNoticeController.addSafetyNotice
  )
  .get("/getAllSafetyNotice", safetyNoticeController.getAllSafetyNotice)
  .get("/getSafetyNotice/:id", safetyNoticeController.getSafetyNoticeById)
  .patch(
    "/updateSafetyNotice/:id",
    upload.fields([
      { name: "copyOfReport", maxCount: 1 },
      { name: "lpo", maxCount: 1 },
      { name: "importationHistory", maxCount: 1 },
      { name: "nhraMedicalDeviceRegistrationLicense", maxCount: 1 },
      { name: "returnInvoice", maxCount: 1 },
      { name: "destructionInvoice", maxCount: 1 },
      { name: "acknowledgment", maxCount: 1 },
      { name: "signature", maxCount: 1 },
      { name: "signatureDeclarationLetter", maxCount: 1 },
    ]),
    safetyNoticeController.updateSafetyNoticeById
  )
  .delete(
    "/deleteSafetyNotice/:id",
    safetyNoticeController.deleteSafetyNoticeById
  );

export default router;
