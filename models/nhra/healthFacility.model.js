import mongoose, { Schema } from 'mongoose'

const healthFacilitySchema = new Schema({
    facilityName:{
        type:String,
        required:true
    },
    facilityAddress:{
        type:String,
        required:true
    },
    personName:{
        type:String,
        required:true
    },
    personPosition:{
        type:String
    },
    personMobile:{
        type:Number
    },
    personEmail:{
        type:String
    },
    personCPR:{
        type:String,
        required:true
    }
},{timestamps:true})

const HealthFacility = mongoose.model("HealthFacility",healthFacilitySchema)
export default HealthFacility