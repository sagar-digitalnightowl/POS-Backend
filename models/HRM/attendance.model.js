import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    shiftType:{
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    holiday:{
        type:String
    },
    autoClockOut:{
        type:Boolean,
        default:false
    }
})

const Attendance = mongoose.model("Attendance",attendanceSchema)
export default Attendance