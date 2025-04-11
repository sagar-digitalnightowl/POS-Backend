import mongoose, { Schema } from "mongoose";

const invoiceSchema=new Schema({
        customer:{
            type:mongoose.Types.ObjectId,
            ref:"Customer",
            required:true
        },
        productName:{
             type:String,
             required:true
        },
        deliveryDate:{
            type:Date,
            required:true
        },
        repairCompletedOn:{
            type:Date,
            required:true

        },
        status:{
           type:String,
           required:true
        },
        brand:{
            type:mongoose.Types.ObjectId,
            ref:"Brand",
            required:true
        },
        device:{
            type:String,
            required:true
        },
        deviceModel:{
            type:mongoose.Types.ObjectId,
            ref:"Product",
            required:true
        },
        serialNumber:{
           type:String,
           required:true
        },
        problemReportedByTheCustomer:{
              type:String
        }
})

const Invoice=mongoose.model("Invoice",invoiceSchema)
export default Invoice