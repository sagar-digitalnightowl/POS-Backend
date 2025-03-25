import express from "express"
import userController from "../../controllers/userManagement/user.controller.js"
const router=express.Router()
router.post("/addUser",userController.addUser)
      .get("/getAllUser",userController.getAllUser)
      .get("/getUser/:id",userController.getUserById)
      .patch("/updateUser/:id",userController.updateUser)
      .delete("/deleteUser/:id",userController.deleteUserById)


export default router      