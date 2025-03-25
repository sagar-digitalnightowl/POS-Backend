import safetyNoticeController from '../../controllers/nhra/safetyNotice.controller.js'
import multer from 'multer'
import express from 'express'

const upload=multer()

const router=express.Router();

router.post('/addSafetyNotice',upload.any(),safetyNoticeController.addSafetyNotice)
      .get("/getAllSafetyNotice",safetyNoticeController.getAllSafetyNotice)
      .get("/getSafetyNotice/:id",safetyNoticeController.getSafetyNoticeById)
      .patch("/updateSafetyNotice/:id",safetyNoticeController.updateSafetyNoticeById)
      .delete("/deleteSafetyNotice/:id",safetyNoticeController.deleteSafetyNoticeById)
      
      
export default router;