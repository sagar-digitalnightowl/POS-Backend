import express from "express"
import jobSheetRoutes from "./jobSheet.routes.js"
import invoiceRoutes from "./invoice.routes.js"
import brandRoutes from "./brand.routes.js"

const router=express.Router()

  router.use("/jobSheet",jobSheetRoutes)
        .use("/invoice",invoiceRoutes)
        .use("/brand",brandRoutes)
        
export default router