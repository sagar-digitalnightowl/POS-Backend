import followupController from '../../controllers/CRM/followupCategory.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addFollowup',followupController.addFollowup)
      .get('/getAllFollowup',followupController.getAllFollowup)
      .get('/getFollowup/:id',followupController.getFollowupById)
      .patch('/updateFollowup/:id',followupController.updateFollowupById)
      .delete('/deleteFollowup/:id',followupController.deleteFollowupById)

export default router;