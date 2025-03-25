import mongoose, { Schema } from "mongoose";

const signUpSchema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    mobileNo:{
        type:Number,
        unique:true
    },
    password:{
        type:String
    },
    otp:{
        type:Number
    },
    verified:{
        type:Boolean,
        default:false
    },
    remember:{
        type:Boolean,
        default:false
    },
    agreement:{
        type:Boolean,
        default:false
    }
})

const SignUp = mongoose.model("SignUp",signUpSchema)
export default SignUp;