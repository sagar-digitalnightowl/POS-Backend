import lifeStageController from '../../controllers/CRM/lifeStage.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addLifeStage',lifeStageController.addLifeStage)
      .get('/getAllLifeStage',lifeStageController.getAllLifeStage)
      .get('/getLifeStage/:id',lifeStageController.getLifeStageById)
      .patch('/updateLifeStage/:id',lifeStageController.updateLifeStageById)
      .delete('/deleteLifeStage/:id',lifeStageController.deleteLifeStageById)

export default router;