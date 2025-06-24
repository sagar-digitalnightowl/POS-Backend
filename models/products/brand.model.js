import mongoose, { Schema } from "mongoose";

const brandSchema=new Schema({
        name:{
            type:String,
             required:true,
             unique:true   
        },
        shortDescription:{
            type:String,
            required:true,
        },
        useForRepair:{
            type:Boolean,
            default:false
        }
}, {timestamps: true})

const Brand=mongoose.model("Brand",brandSchema)

export default Brand 