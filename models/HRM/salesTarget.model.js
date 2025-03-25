import mongoose, { Schema } from "mongoose";

const salesTargetSchema = new Schema({
  targets: [
    {
      totalSalesAmountFrom: {
        type: Number,
        required: true,
        min: 0,
      },
      totalSalesAmountTo: {
        type: Number,
        required: true,
        min: 0,
      },
      commissionPercentage: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

const SalesTarget = mongoose.model("SalesTarget", salesTargetSchema);
export default SalesTarget;
