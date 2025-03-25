import expenseController from '../../controllers/expense/expense.controller.js'
import multer from "multer"
import express from 'express'

const upload=multer()

const router=express.Router();

router.post('/addExpense',upload.single('attachDocument'),expenseController.addExpense)
      .get('/getAllExpense',expenseController.getAllExpense)
      .get('/getExpense/:id',expenseController.getExpenseById)
      .patch('/updateExpense/:id',expenseController.updateExpenseId)
      .delete('/deleteExpense/:id',expenseController.deleteExpenseId)

export default router;

