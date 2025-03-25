import mongoose, { Schema } from "mongoose";

const customerGroupSchema=new Schema({
    customerGroupName:{
        type:String,
        required:true
    },
    priceCalculationType:{
        type:String,
        required:true
    },
    calculationPercentage:{  
    type: Number, 
    min: [0, "Percentage cannot be less than 0"], 
    max: [100, "Percentage cannot be more than 100"], 
    required: [true, "calculationPercentage is required"]
    } 
},{timestamps:true})


const CustomerGroup=mongoose.model("CustomerGroup",customerGroupSchema);

export default CustomerGroup