import mongoose, { Schema } from 'mongoose'

const designationSchema = new Schema({
    designation:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const Designation = mongoose.model("Designation",designationSchema)
export default Designation