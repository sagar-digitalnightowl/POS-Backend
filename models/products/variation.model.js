import mongoose from "mongoose";

const variationSchema=new mongoose.Schema({
    variationName:{
         type:String,
         required:true,
        //  unique:true 
    },
    addVariationValue:{
        type:String,
        required:true,
        // unique:true
    }     
},{timestamps:true})

const Variation=mongoose.model("Variation",variationSchema)
export default Variation;
