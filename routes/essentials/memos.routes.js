import memoController from '../../controllers/essentials/memos.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addMemo',memoController.addMemo)
      .get('/getAllMemo',memoController.getAllMemo)
      .get('/getMemo/:id',memoController.getMemoById)
      .patch('/updateMemo/:id',memoController.updateMemoById)
      .delete('/deleteMemo/:id',memoController.deleteMemoById)

export default router;