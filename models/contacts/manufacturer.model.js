import mongoose, { Schema } from "mongoose";

const manufacturerSchema=new Schema({
    name:{
        type:String,
        required :true
    },
    address:{
        type:String,
    },
    telephone:{
        type:Number,
    },
    fax:{
        type:String
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    website:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    profilePhotoUrl:{
        url:{type: String}
    },
    letterUrl:{
        type:String
    },

},{timestamps:true})

const Manufacturer=mongoose.model("Manufacturer",manufacturerSchema);

export default Manufacturer;