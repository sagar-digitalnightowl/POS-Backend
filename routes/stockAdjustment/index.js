import express from 'express'
import stockAdjustment from './stockAdjustment.routes.js'

const router = express.Router()

router
     .use("/stockAdjustmentList",stockAdjustment)

export default router;