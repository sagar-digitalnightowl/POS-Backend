import mongoose, { Schema } from 'mongoose'

const departmentSchema = new Schema({
    department:{
        type:String,
        required:true
    },
    departmentId:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
})

const Department = mongoose.model("Department",departmentSchema)
export default Department;

