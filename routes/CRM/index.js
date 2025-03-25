import express from 'express'
import campaignRoutes from './campaigns.routes.js'
import contactsLoginRoutes from './contactsLogin.routes.js'
import sourceRoutes from './sources.routes.js'
import lifeStageRoutes from './lifeStage.routes.js'
import followupRoutes from './followupCategory.routes.js'

const router = express.Router()

router.use('/campaign',campaignRoutes)
      .use('/contactsLogin',contactsLoginRoutes)
      .use('/source',sourceRoutes)
      .use('/lifeStage',lifeStageRoutes)
      .use('/followup',followupRoutes)

export default router;