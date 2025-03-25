import express from 'express'
import adverseEventController from '../../controllers/nhra/adverseEvent.controller.js'
import multer from "multer"

const upload=multer()

const router=express.Router();

router.post('/addAdverseEvent',upload.any(),adverseEventController.addAdverseEvent)
      .get("/getAllAdverseEvent",adverseEventController.getAllAdverseEvent)
      .get("/getAdverseEvent/:id",adverseEventController.getAdverseEventById)
      .patch("/updateAdverseEvent/:id",adverseEventController.updateAdverseEventById)
      .delete("/deleteAdverseEvent/:id",adverseEventController.deleteAdverseEventById)
      
      
export default router;