import mongoose, {Schema} from "mongoose"

const purchaseImportSchema = new Schema({
    fileToImport:{
        type:String
    }
})

const PurchaseImport = mongoose.model("PurchaseImport",purchaseImportSchema)
export default PurchaseImport;