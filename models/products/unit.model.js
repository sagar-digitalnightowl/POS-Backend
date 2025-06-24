import mongoose, { Schema } from "mongoose";

const unitSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    shortName: {
        type: String,
        required: true,
        unique: true
    },
    allowDecimal: {
        type: String,
        default: "no"
    }
}, { timestamps: true })

const Unit = mongoose.model("Unit", unitSchema)

export default Unit 