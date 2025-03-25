import sourcesController from '../../controllers/CRM/sources.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addSource',sourcesController.addSource)
      .get('/getAllSource',sourcesController.getAllSource)
      .get('/getSource/:id',sourcesController.getSourceById)
      .patch('/updateSource/:id',sourcesController.updateSourceById)
      .delete('/deleteSource/:id',sourcesController.deleteSourceById)

export default router;