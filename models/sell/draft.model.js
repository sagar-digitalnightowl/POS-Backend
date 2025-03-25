import mongoose, { Schema } from "mongoose";

const draftSchema = new Schema({
    customer:{
            type:mongoose.Types.ObjectId,
            ref:"CustomerAndSupplier",
            required:true
        },
        payTerm: {
            value: { type: Number }, 
            unit: {
              type: String,
              enum: ["Months", "Days"],
            },
        },
        saleDate:{
            type: Date,
            deafult: Date.now,
            required:true
        },
        status:{
            type:String,
            enum:["Please Select","Final","Draft","Quotation","Proforma"],
            required:true
        },
        invoiceSchema:{
            type:String,
        },
        invoiceNo:{
            type:String
        },
        attachDocument:{
            type:String
        },
        discountType:{
            type:String,
            enum:["Please Select","Fixed","Percentage"],
            required:true
        },
        discountAmount:{
            type:Number,
            required:true
        },
        orderTax:{
            type:String,
            enum:["Please Select","None"]
        },
        sellNote:{
            type:String
        },
        shippingDetails:{
            type:String
        },
        shippingAddress:{
            type:String
        },
        shippingCharges:{
            type:Number
        },
        shippingStatus:{
            type:String,
            enum:["Please Select","Ordered","Packed","Shipped","Delivered","Cancelled"]
        },
        deliveredTo:{
            type:String
        },
        deliveryPerson:{
            type:String
        },
        shippingDocuments:{
            type:String
        },
        additionalExpenses: [
            {
              name: {
                 type: String
                },
              amount: { 
                 type: Number, default: 0 
                }, 
            },
          ],
        },
        { timestamps: true }
)

const Draft = mongoose.model("Draft",draftSchema)
export default Draft;