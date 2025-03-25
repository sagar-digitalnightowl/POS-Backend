import service_MaintenanceController from '../../controllers/nhra/service_Maintenance.Controller.js'
import express from 'express'

const router = express.Router();

router.post('/addServiceMaintenance',service_MaintenanceController.addServiceMaintenance)
      .get('/getAllServiceMaintenance',service_MaintenanceController.getAllServiceMaintenance)
      .get('/getServiceMaintenance/:id',service_MaintenanceController.getServiceMaintenanceById)
      .patch('/updateServiceMaintenance/:id',service_MaintenanceController.updateServiceMaintenanceById)
      .delete('/deleteServiceMaintenance/:id',service_MaintenanceController.deleteServiceMaintenanceById)

export default router;