import mongoose, { Schema } from "mongoose";

const contactsLoginSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        enum:[
            "Walk-In Customer (CO0001)",
            "Test (CO0002)",
            "Seeam - (CO0003)",
            "Zamini (CO0004)"
        ],
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    familyContactNo:{
        type:Number
    },
    alternateContactNo:{
        type:Number
    },
    department:{
        type:String
    },
    designation:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:false
    },
    allowLogin:{
        type:Boolean,
        default:false
    },
    salesCommission:{
        type:String,
    }
},{timestamps:true})

const ContactsLogin = mongoose.model("ContactsLogin",contactsLoginSchema)
export default ContactsLogin;