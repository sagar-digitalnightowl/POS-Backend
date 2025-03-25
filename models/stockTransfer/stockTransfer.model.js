import mongoose, { Schema } from 'mongoose'

const stockTransferSchema = new Schema({
    date:{
        type:Date,
        default: Date.now
    },
    referenceNo:{
        type:String,
    },
    status:{
        type:String,
        enum:["Please Select","Pending","In Transit","Completed"],
        required:true
    },
    locationFrom:{
        type:String
    },
    locationTo:{
        type:String
    },
    shippingCharges:{
        type:Number
    },
    additionalNotes:{
        type:String
    }
})

const StockTransfer = mongoose.model("StockTransfer",stockTransferSchema)
export default StockTransfer