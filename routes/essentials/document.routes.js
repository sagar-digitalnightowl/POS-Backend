import documentController from '../../controllers/essentials/documents.controller.js'
import express from 'express'
import { upload } from '../../middlewares/multer.middleware.js'

const router=express.Router();

router.post("/addDocument",upload.single("document"),documentController.addDocument)
      .get("/getAllDocument",documentController.getAllDocument)
      .get("/getDocument/:id",documentController.getDocumentById)
      .patch("/updateDocument/:id",upload.single("document"),documentController.updateDocumentById)
      .delete("/deleteDocument/:id",documentController.deleteDocumentById)


export default router;