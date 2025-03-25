import mongoose, {Schema} from "mongoose"

const userSchema=new Schema({
    prefix:{
      type:String
    },
    firstName:{
        type:String,
        required:true 
    },
    lastName:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true ,
        unique:true

    },
    active:{
        type:Boolean,
        default:false
    },
    enableServiceStaffPin:{
        type:Boolean,
        default:false
    },
    userProfile:{
        type:Schema.Types.ObjectId,
        ref:"UserProfile",
    }
  
},{timestamps:true})
const User=mongoose.model("User",userSchema)
export default User 