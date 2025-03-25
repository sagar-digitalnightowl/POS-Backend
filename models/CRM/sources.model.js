import mongoose, { Schema } from "mongoose";

const sourceSchema = new Schema({
    source:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const Source  = mongoose.model('Source',sourceSchema)
export default Source