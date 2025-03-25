import departmentController from '../../controllers/HRM/department.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addDepartment',departmentController.addDepartment)
      .get('/getAllDepartment',departmentController.getAllDepartment)
      .get('/getDepartment/:id',departmentController.getDepartmentById)
      .patch('/updateDepartment/:id',departmentController.updateDepartmentById)
      .delete('/deleteDepartment/:id',departmentController.deleteDepartmentById)

export default router;