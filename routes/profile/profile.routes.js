import profileController from '../../controllers/profile/profile.controller.js'
import express from 'express'
import { upload } from '../../middlewares/multer.middleware.js'

const router=express.Router();

router.post("/addProfile",upload.single("uploadImage"),profileController.addProfile)
      .get("/getAllProfile",profileController.getAllProfile)
      .get("/getProfile/:id",profileController.getProfileById)
      .patch("/updateProfile/:id",upload.single("uploadImage"),profileController.updateProfileById)
      .delete("/deleteProfile/:id",profileController.deleteProfileById)


export default router;