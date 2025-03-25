import mongoose, { Schema } from 'mongoose'

const taxGroupSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    subTaxes:[{
        type:Schema.Types.ObjectId,
        ref:'TaxRate',
        required:true
}]

},{timestamps:true})

const TaxGroup =mongoose.model('TaxGroup',taxGroupSchema)
export default TaxGroup