import express from "express"
import productListRouter  from "./listProduct.routes.js"
import variationRoutes from "./variation.routes.js" 
import sellingPriceGroupRoutes from "./sellingPriceGroup.routes.js" 
import unitRoutes from "./unit.routes.js"
import categoryRoutes from "./category.routes.js"  
import brandRoutes from "./brand.routes.js"
import productMappingRoutes from "./productMapping.routes.js"
import warrantyRoutes from "./warranty.routes.js"
const router=express.Router()

router.use("/productList",productListRouter)
router.use("/variation",variationRoutes)
router.use("/sellingPriceGroup",sellingPriceGroupRoutes)
router.use("/unit",unitRoutes)
router.use("/category",categoryRoutes)
router.use("/brand",brandRoutes)
router.use("/productMapping",productMappingRoutes)
router.use("/warranty",warrantyRoutes)
export default router   