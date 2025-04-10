import express from "express"
import jobSheetController from "../../controllers/repair/jobSheet.controller.js"
import { upload } from "../../middlewares/multer.middleware.js";

const router=express.Router()

router.post("/addJobSheet",upload.single("document"),jobSheetController.addJobSheet)
      .get("/getAllJobSheet",jobSheetController.getAllJobSheet)
      .get("/getJobSheet/:id",jobSheetController.getJobSheetById)
      .patch("/updateJobSheet/:id",upload.single("document"),jobSheetController.updateJobSheetById)
      .delete("/deleteJobSheet/:id",jobSheetController.deleteJobSheetById)
      
export default router
 
