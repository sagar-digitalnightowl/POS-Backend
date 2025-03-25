import express from "express"
import jobSheetController from "../../controllers/repair/jobSheet.controller.js"
import multer from "multer" 
const router=express.Router()
const upload=multer()

router.post("/addJobSheet",upload.any(),jobSheetController.addJobSheet)
      .get("/getAllJobSheet",jobSheetController.getAllJobSheet)
      .get("/getJobSheet/:id",jobSheetController.getJobSheetById)
      .patch("/updateJobSheet/:id",jobSheetController.updateJobSheetById)
      .delete("/deleteCategory/:id",jobSheetController.deleteJobSheetById)
      
      export default router
 
