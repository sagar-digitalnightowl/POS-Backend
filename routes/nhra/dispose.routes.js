import express from 'express'
import disposeController from '../../controllers/nhra/dispose.controller.js'
import multer from 'multer'

const upload = multer()
const router = express.Router();

router.post('/addDispose',upload.any(),disposeController.addDispose)
      .get('/getAllDispose',disposeController.getAllDispose)
      .get('/getDispose/:id',disposeController.getDisposeById)
      .patch('/updateDispose/:id',disposeController.updateDisposeById)
      .delete('/deleteDispose/:id',disposeController.deleteDisposeById)

export default router;