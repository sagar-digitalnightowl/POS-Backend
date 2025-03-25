import mongoose, { Schema } from "mongoose";

const sellingPriceGroupSchema=new Schema({
    name:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
    }
})

const SellingPriceGroup=mongoose.model("SellingPriceGroup",sellingPriceGroupSchema) 
export default SellingPriceGroup;