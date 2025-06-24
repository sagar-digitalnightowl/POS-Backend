import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  shiftType: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  workingDays: [
    {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  ],
  autoClockOut: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});


const Shift = mongoose.model('Shift', ShiftSchema)
export default Shift;