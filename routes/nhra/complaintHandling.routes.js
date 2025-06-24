import express from "express";
import complaintHandlingController from "../../controllers/nhra/complaintHandling.controller.js";
import multer from "multer";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addComplaintHandling",
    upload.fields([{ name: "supportiveDocuments", maxCount: 1 }]),
    complaintHandlingController.addComplaintHandling
  )
  .get(
    "/getAllComplaintHandling",
    complaintHandlingController.getAllComplaintHandling
  )
  .get(
    "/getComplaintHandling/:id",
    complaintHandlingController.getComplaintHandlingById
  )
  .patch(
    "/updateHandling/:id",
    upload.fields([{ name: "supportiveDocuments", maxCount: 1 }]),
    complaintHandlingController.updateHandlingById
  )
  .delete(
    "/deleteHandling/:id",
    complaintHandlingController.deleteHandlingById
  );

export default router;
