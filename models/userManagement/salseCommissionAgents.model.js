import mongoose, { Schema } from "mongoose";

const selseCommissionAgentSchema = new Schema({
  prefix: {
    type: String,
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique:true
  },
  contactNo: {
    type: Number,
  },
  address: {
    type: String,
  },
  salesCommissionPercentage: {
    type: Number,
  },
},{timestamps:true});

const selseCommissionAgent = mongoose.model(
  "SelseCommissionAgent",
  selseCommissionAgentSchema
);
export default selseCommissionAgent;
