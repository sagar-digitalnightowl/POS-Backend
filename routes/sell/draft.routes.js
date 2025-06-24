import express from 'express'
import multer from 'multer'
import draftController from '../../controllers/sell/draft.controller.js'
import { upload } from '../../middlewares/multer.middleware.js';

const uploads = multer()

const router = express.Router();

router.post("/addDraft",
      upload.fields([
            { name: "attachDocument", maxCount: 1 },
            { name: "shippingDocuments", maxCount: 1 },
      ]),
      draftController.addDraft)
      .get("/getAllDraft", draftController.getAllDraft)
      .get("/getDraft/:id", draftController.getDraftById)
      .patch("/updateDraft/:id",
            upload.fields([
                   { name: "attachDocument", maxCount: 1 },
                  { name: "shippingDocuments", maxCount: 1 },
            ]),
            draftController.updateDraftById)
      .delete("/deleteDraft/:id", draftController.deleteDraftById)


export default router;