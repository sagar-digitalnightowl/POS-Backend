import mongoose from "mongoose";

const warrantySchema=new mongoose.Schema({
    name:{
         type:String,
         required:true,
         unique:true 
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required: true,
        min:[1,"Duration is less than 1"]
    }     
},{timestamps:true})

const Warranty=mongoose.model("Warranty",warrantySchema)
export default Warranty;
