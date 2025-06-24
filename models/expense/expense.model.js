import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    businessLocation: {
      type: String,
    },
    expenseCategory: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseCategory",
    },
    subCategory: {
      type: String,
    },
    referenceNo: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    expenseFor: {
      type: String,
    },
    expenseForContact: {
      type: String,
    },
    // file
    attachDocument: {
      type: String,
    },
    applicableTax: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    expenseNote: {
      type: String,
    },
    isRefund: {
      type: Boolean,
      default: false,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringinterval: {
        value: {type: String},
        unit: {type: String, enum: ['Days', 'Months', 'Years']}
    },
    numberOfRepetitions: {
        type: String
    },
    payment: {
      amount: { type: String },
      paidOn: { type: String, default: Date.now },
      paymentMethod: {
        type: String,
        required: true,
        enum: [
          "Cash",
          "Card",
          "Cheque",
          "Bank Transfer",
          "Other",
          "Benefit Pay",
          "Custom Payment 2",
          "Custom Payment 3",
        ],
      },
      paymentNote: { type: String },
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
