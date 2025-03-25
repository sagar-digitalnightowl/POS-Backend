import express from 'express'
import complaintHandlingController from '../../controllers/nhra/complaintHandling.controller.js'
import multer from 'multer'

const upload = multer()
const router = express.Router();

router.post('/addComplaintHandling',upload.single("supportiveDocuments"),complaintHandlingController.addComplaintHandling)
      .get('/getAllComplaintHandling',complaintHandlingController.getAllComplaintHandling)
      .get('/getComplaintHandling/:id',complaintHandlingController.getComplaintHandlingById)
      .patch('/updateHandling/:id',complaintHandlingController.updateHandlingById)
      .delete('/deleteHandling/:id',complaintHandlingController.deleteHandlingById)

export default router;