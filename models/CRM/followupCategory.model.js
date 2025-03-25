import mongoose, { Schema } from "mongoose";

const followupSchema = new Schema({
    followupCategory:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const  Followup = mongoose.model("Followup",followupSchema)
export default Followup