import express from 'express'
import profileRoutes from './profile.routes.js'

const router = express.Router()

router.use("/adminProfile",profileRoutes)

export default router;