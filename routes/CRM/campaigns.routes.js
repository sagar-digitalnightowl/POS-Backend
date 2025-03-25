import campaignController from '../../controllers/CRM/campaigns.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addCampaign',campaignController.addCampaign)
      .get('/getAllCampaign',campaignController.getAllCampaign)
      .get('/getCampaign/:id',campaignController.getCampaignById)
      .patch('/updateCampaign/:id',campaignController.updateCampaignById)
      .delete('/deleteCampaign/:id',campaignController.deleteCampaignById)

export default router;