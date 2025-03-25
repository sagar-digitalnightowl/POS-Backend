import express from 'express'
import stockTransfer from './stockTransfer.routes.js'

const router = express.Router()

router
     .use("/stockList",stockTransfer)

export default router;