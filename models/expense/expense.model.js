import mongoose, { Schema } from 'mongoose'

const expenseSchema = new Schema({
    businessLocation:{
        type:Schema.Types.ObjectId,
        ref:'Product',
    },
    expenseCategory:{
        type:Schema.Types.ObjectId,
        ref:'ExpenseCategory',
    },
    subCategory:{
        type:String,
    },
    referenceNo:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    expenseFor:{
        type:String
    },
    expenseForContact:{
        type:String
    },
    attachDocument:{
        type:String
    },
    applicableTax:{
        type:String
    },
    totalAmount:{
        type:Number
    },
    expenseNote:{
        type:String
    },
    isRefund:{
        type:Boolean,
        default: false
    },
    amount:{
        type:Number,
        required:true,
        min: 0
    },
    paidOn: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: [
            "Cash",
            "Card",
            "Cheque",
            "Bank Transfer",
            "Other",
            "Benefit Pay",
            "Custom Payment 2",
            "Custom Payment 3"
        ]
    },
    paymentNote:{
        type:String,
    }

},{timestamps: true}
)

const Expense = mongoose.model("Expense",expenseSchema)
export default Expense;