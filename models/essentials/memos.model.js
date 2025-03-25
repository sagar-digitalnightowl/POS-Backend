import mongoose, { Schema } from 'mongoose'

const memoSchema = new Schema({
    heading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const Memo = mongoose.model("Memo",memoSchema)
export default Memo