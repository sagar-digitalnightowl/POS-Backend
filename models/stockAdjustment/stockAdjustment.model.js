import mongoose, { Schema } from 'mongoose'

const stockAdjustmentSchema = new Schema({
    businessLocation:{
        type:String,
        required:true
    },
    referenceNo:{
        type:String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    adjustmentType:{
        type:String,
        enum:["Please Select","Normal","Abnormal"],
        required:true
    },
    totalAmountRecovered:{
        type:Number,
    },
    reason:{
        type:String
    }
})

const StockAdjustment = mongoose.model("StockAdjustment",stockAdjustmentSchema)
export default StockAdjustment