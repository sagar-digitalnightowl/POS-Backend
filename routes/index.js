import express from "express"
import userManegmentRoutes from "./userManagement/index.js"
import contactsRoutes from "./contacts/index.js"
import productRoutes from "./products/index.js"
import repairRoutes from "./repair/index.js"
import purchaseRoutes from "./purchase/index.js"
import sellRoutes from "./sell/index.js"
import stockTransfer from "./stockTransfer/index.js"
import StockAdjustment from "./stockAdjustment/index.js"
import nhra from "./nhra/index.js"
import expense from "./expense/index.js"
import settings from "./settings/index.js"
import crm from "./CRM/index.js"
import hrm from "./HRM/index.js"
import profile from "./profile/index.js"
import essentials from "./essentials/index.js"
import admin from "./admin/index.js"


const router=express.Router()

router.use("/userManagement",userManegmentRoutes)
      .use("/contacts",contactsRoutes)
      .use("/product",productRoutes)
      .use("/repair",repairRoutes)
      .use("/purchase",purchaseRoutes)
      .use("/sell",sellRoutes)
      .use("/stockTransfer",stockTransfer)
      .use("/stockAdjustment",StockAdjustment)
      .use("/nhra",nhra)
      .use("/expense",expense)
      .use("/settings",settings)
      .use("/crm",crm)
      .use("/hrm",hrm)
      .use("/essentials",essentials)
      .use("/profile",profile)
      .use("/admin",admin)


export default router