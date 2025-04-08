import mongoose, { Schema } from "mongoose";

const productMappingSchema=new Schema({
        accountName:{
            type:String,
            required:true,
        },
        representativeName:{
            type:String,
            required:true,
        },
        itemDescription:{
            type:String,
            required:true
        },
        mappedPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        }
})

const ProductMapping=mongoose.model("ProductMapping",productMappingSchema)

export default ProductMapping

