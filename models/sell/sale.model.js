import mongoose, { Schema } from "mongoose";

const saleSchema = new Schema({
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
      payments:[
        {
            amount: { type: Number, required: true },
            paidOn: { type: Date, default: Date.now },
            paymentMethod: {
                type: String,
                enum: ["Advance", "Cash", "Card", "cheque", "Bank Transfer", "Other", "Benefit Pay", "Custom Payment 2","Custom Payment 3","Custom Payment 4","Custom Payment 5","Custom Payment 6","Custom Payment 7"],
                required: true,
              },
            paymentNote: { type: String},
            isCreditSale: { type: Boolean, default: false }
        }
      ]
    },
    { timestamps: true }
)

const Sale = mongoose.model("Sale",saleSchema)
export default Sale;