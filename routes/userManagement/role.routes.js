import express from "express"
import roleController from "../../controllers/userManagement/role.controller.js"
const router=express.Router()
router.post("/addRole",roleController.createRole)
      .get("/getAllRole",roleController.getAllRole)
      .get("/getRole/:id",roleController.getRoleById)
      .patch("/updateRole/:id",roleController.updateRoleById)
      .delete("/deleteRole/:id",roleController.deleteRoleById)

export default router      