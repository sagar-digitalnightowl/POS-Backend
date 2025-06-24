import express from "express";
import authorizedRepresentativeController from "../../controllers/nhra/authorizedRepresentative.controller.js";
import multer from "multer";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addAuthorizedRepresentative",
    upload.fields([{ name: "authorizedCertificate", maxCount: 1 }]),
    authorizedRepresentativeController.addAuthorizedRepresentative
  )
  .get(
    "/getAllAuthorizedRepresentative",
    authorizedRepresentativeController.getAllAuthorizedRepresentative
  )
  .get(
    "/getAuthorizedRepresentatives",
    authorizedRepresentativeController.getAuthorizedRepresentatives
  )
  .get(
    "/getAuthorizedRepresentative/:id",
    authorizedRepresentativeController.getAuthorizedRepresentativeById
  )
  .patch(
    "/updateAuthorizedRepresentative/:id",
    upload.fields([{ name: "authorizedCertificate", maxCount: 1 }]),
    authorizedRepresentativeController.updateAuthorizedRepresentativeById
  )
  .delete(
    "/deleteAuthorizedRepresentative/:id",
    authorizedRepresentativeController.deleteAuthorizedRepresentativeById
  );

export default router;
