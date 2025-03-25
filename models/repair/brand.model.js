import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({
    brandName:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required:true
    },
    shortDescription:{
        type: String,
        required:true
    }
})

const RepairBrand = mongoose.model("RepairBrand",brandSchema)
export default RepairBrand;