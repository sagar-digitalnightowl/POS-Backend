import mongoose, { Schema } from 'mongoose'

const healthFacilitySchema = new Schema({
    facility_name:{
        type:String,
        required:true
    },
    facility_address:{
        type:String,
        required:true
    },
    person_name:{
        type:String,
        required:true
    },
    person_position:{
        type:String
    },
    person_mobile:{
        type:Number
    },
    person_email:{
        type:String
    },
    person_cpr:{
        type:String,
        required:true
    }
},{timestamps:true})

const HealthFacility = mongoose.model("HealthFacility",healthFacilitySchema)
export default HealthFacility