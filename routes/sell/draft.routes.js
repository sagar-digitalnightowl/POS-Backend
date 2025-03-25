import express from 'express'
import multer from 'multer'
import draftController from '../../controllers/sell/draft.controller.js'

const uploads=multer()

const router=express.Router();

router.post("/addDraft",uploads.any(),draftController.addDraft)
      .get("/getAllDraft",draftController.getAllDraft)
      .get("/getDraft/:id",draftController.getDraftById)
      .patch("/updateDraft/:id",draftController.updateDraftById)
      .delete("/deleteDraft/:id",draftController.deleteDraftById)



export default router;