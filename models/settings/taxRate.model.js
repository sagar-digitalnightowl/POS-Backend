import mongoose, { Schema } from 'mongoose'

const taxRateSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    taxRatePercentage:{
        type:Number,
        required:true
    },
    forTaxGroupOnly:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const TaxRate = mongoose.model("TaxRate",taxRateSchema)
export default TaxRate