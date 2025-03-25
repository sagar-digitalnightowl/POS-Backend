import mongoose, { Schema } from "mongoose";

const leaveTypeSchema = new Schema({
    leaveType:{
        type:String,
        required:true
    },
    maxLeaveCount:{
        type:Number,
        required:true
    },
    leaveCountInterval:{
        type:String,
        enum:[
            "Current Month",
            "Current Financial Year",
            "None"
        ],
        required:true
    }
})

const LeaveType = mongoose.model('LeaveType',leaveTypeSchema)
export default LeaveType;