import express from 'express'
import importationController from '../../controllers/nhra/importation.controller.js'
import multer from "multer"

const upload=multer()

const router=express.Router();

router.post('/addImportation',upload.any(),importationController.addImportation)
      .get("/getAllImportation",importationController.getAllImportation)
      .get("/getImportation/:id",importationController.getImportationById)
      .patch("/updateImportation/:id",importationController.updateImportationById)
      .delete("/deleteImportation/:id",importationController.deleteImportationById)
      
      
export default router;