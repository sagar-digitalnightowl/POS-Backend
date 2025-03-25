import mongoose, { Schema } from 'mongoose'

const campaignsSchema = new Schema({
    campaignName:{
        type:String,
        required:true
    },
    campaignType:{
        type:String,
        enum:["Sms","Email"],
        required:true
    },
    to:{
        type:String,
        enum:["Customers","Leads","Transaction activity","Contact"],
        reuired:true
    }

},{timestamps:true})

const Campaign = mongoose.model('Campaign',campaignsSchema)
export default Campaign