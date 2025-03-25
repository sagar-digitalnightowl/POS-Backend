import express from 'express'
import adminRoutes from './admin.routes.js'

const router = express.Router();

router.use("/adminSign",adminRoutes)

export default router;