import express from 'express'
import healthCareFacilityController from '../../controllers/nhra/healthFacility.controller.js'

const router=express.Router();

router.post('/addhealthFacility',healthCareFacilityController.addhealthFacility)
      .get("/getAllHealthFacility",healthCareFacilityController.getAllHealthFacility)
      .get("/getHealthFacility/:id",healthCareFacilityController.getHealthFacilityById)
      .patch("/updateHealthFacility/:id",healthCareFacilityController.updateHealthFacilityById)
      .delete("/deleteHealthFacility/:id",healthCareFacilityController.deleteHealthFacilityById)
       
export default router;