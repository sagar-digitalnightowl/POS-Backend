import express from 'express'
import authorizedRepresentativeController from '../../controllers/nhra/authorizedRepresentative.controller.js'
import multer from "multer"

const upload=multer()

const router=express.Router();

router.post('/addAuthorizedRepresentative',upload.single("authorizedCertificate"),authorizedRepresentativeController.addAuthorizedRepresentative)
      .get("/getAllAuthorizedRepresentative",authorizedRepresentativeController.getAllAuthorizedRepresentative)
      .get("/getAuthorizedRepresentative/:id",authorizedRepresentativeController.getAuthorizedRepresentativeById)
      .patch("/updateAuthorizedRepresentative/:id",authorizedRepresentativeController.updateAuthorizedRepresentativeById)
      .delete("/deleteAuthorizedRepresentative/:id",authorizedRepresentativeController.deleteAuthorizedRepresentativeById)
      
      
export default router;