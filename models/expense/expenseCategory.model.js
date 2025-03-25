import mongoose, { Schema } from 'mongoose'

const expenseCategorySchema = new Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryCode:{
        type:String,
        required:true
    },
    addAsSubcategory:{
        type:Boolean,
        default:false
    }
})

const ExpenseCategory = mongoose.model('ExpenseCategory',expenseCategorySchema)
export default ExpenseCategory