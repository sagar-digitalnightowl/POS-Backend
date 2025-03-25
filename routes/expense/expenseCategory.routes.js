import expenseCategoryController from '../../controllers/expense/expenseCategory.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addExpenseCategory',expenseCategoryController.addExpenseCategory)
      .get('/getAllExpenseCategory',expenseCategoryController.getAllExpenseCategory)
      .get('/getExpenseCategory/:id',expenseCategoryController.getExpenseCategoryById)
      .patch('/updateExpenseCategory/:id',expenseCategoryController.updateExpenseCategoryById)
      .delete('/deleteExpenseCategory/:id',expenseCategoryController.deleteExpenseCategoryById)


export default router