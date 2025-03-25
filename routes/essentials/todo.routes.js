import todoController from '../../controllers/essentials/todo.controller.js'
import express from 'express'
import {upload} from '../../middlewares/multer.middleware.js'

const router = express.Router()

router.post('/addTodo',upload.single('uploadDocument'),todoController.addTodo)
      .get('/getAllToDo',todoController.getAllToDo)
      .get('/getToDo/:id',todoController.getToDoById)
      .patch('/updateToDo/:id',upload.single('uploadDocument'),todoController.updateToDoById)
      .delete('/deleteToDo/:id',todoController.deleteToDoById)

export default router;