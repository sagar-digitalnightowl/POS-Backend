import mongoose, { Schema } from 'mongoose'

const toDoSchema = new Schema({
    task:{
        type:String,
        required:true
    },
    assignedTo:{
        type:String,
        default:'POS ADMIN'
    },
    priority:{
        type:String,
        enum:[
            "Low",
            "Medium",
            "High",
            "Urgent"
        ],
        required:true
    },
    status:{
        type:String,
        enum:[
            "New",
            "In-Progress",
            "On Hold",
            "Completed"
        ],
        required:true
    },
    startDate:{
        type:Date,
        default:Date.now
    },
    endDate:{
        type:Date
    },
    estimatedHours:{
        type:String
    },
    description:{
        type:String
    },
    uploadDocument:{
        type:String
    }
})

const ToDo = mongoose.model('ToDo',toDoSchema)
export default ToDo