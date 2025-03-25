import mongoose, {Schema} from "mongoose"

const purchaseReturnSchema = new Schema({
    supplier:{
        type:mongoose.Types.ObjectId,
        ref:"CustomerAndSupplier",
        required:true
    },
    businessLocation:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    referenceNo:{
        type:String,
    },
    date:{
        type:Date,
        required:true
    },
    attachDocuments:{
        type:String
    },
    purchaseTax:{
        type:String
    }
})

const PurchaseReturn = mongoose.model("PurchaseReturn",purchaseReturnSchema)
export default PurchaseReturn;