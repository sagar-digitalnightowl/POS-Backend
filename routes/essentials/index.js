import memoRoutes from './memos.routes.js'
import documentRoutes from './document.routes.js'
import todoRoutes from './todo.routes.js'
import express from 'express'

const router = express.Router()

router.use('/memoList',memoRoutes)
      .use('/document',documentRoutes)
      .use('/todoList',todoRoutes)

export default router;