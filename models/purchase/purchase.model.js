import mongoose, {Schema} from "mongoose"

const purchaseSchema = new Schema({
    supplier:{
        type:mongoose.Types.ObjectId,
        ref:"CustomerAndSupplier",
        required:true
    },
    referenceNo:{
        type:String,
    },
    purchaseDate:{
        type:Date,
        required:true
    },
    purchaseStatus:{
        type:String,
        enum:["Received","Pending","Ordered"],
        required:true
    },
    businessLocation:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    payTerm: {
        duration: {
          type: Number,
          min: 1, 
        },
        termType: {
          type: String,
          enum: ["Days", "Months"],
        },
      },
    attachDocument:{
        type:String
    },
    discountType:{
        type:String,
        enum:[
            "None","Fixed","Percentage"
        ]
    },
    discountAmount:{
        type:Number,
    },
    purchaseTax:{
        type:String
    },
    additionalNotes:{
        type:String
    },
    shippingDetails:{
        type:String
    },
    additionalShippingcharges:{
        type:Number
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    paidOn:{
        type:Date,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentNote:{
        type:String
    }

},{ timestamps: true })

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
