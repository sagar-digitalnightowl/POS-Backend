import expenseCategoryRoutes from './expenseCategory.routes.js'
import expenseRoutes from './expense.routes.js'
import express from 'express'

const router = express.Router()

router.use('/expenseCategory',expenseCategoryRoutes)
      .use('/addExpense',expenseRoutes)

export default router;
