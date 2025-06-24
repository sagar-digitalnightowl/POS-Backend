import mongoose, { Schema } from "mongoose";

const service_MaintenanceSchema = new Schema(
  {
    device: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    healthcarefacility: {
      type: Schema.Types.ObjectId,
      ref: "HealthFacility",
    },

    repairMaintenanceServiceRequested: {
      type: [String],
      enum: [
        "Emergency",
        "Equipment Repair",
        "Corrective",
        "Preventive",
        "Regular Maintenance",
        "48 Hours",
        "Installation",
        "Pre-Installation",
        "Vandalism",
        "Field Modification",
        "Other",
      ],
    },
    dateOfRequestforMaintenance: {
      type: Date,
      default: Date.now,
    },
    dateOfMaintenance: {
      type: Date,
      default: Date.now,
    },
    descriptionOfMaintenanceActivities: {
      type: String,
    },
    detailsOfMaterialsUsed: {
      type: String,
    },
    jobCompleted: {
      type: String,
      enum: ["Yes", "No", "N/A"],
    },
    replacementOrRemovalOfEquipmentNeeded: {
      type: String,
      enum: ["Yes", "No", "N/A"],
    },
    isTheEquipmentLabelledWithTheLastAndNextDateOfCalibrationMaintenance: {
      type: String,
      enum: ["Yes", "No", "N/A"],
    },
    maintenanceActivityPerformedBy: {
      type: String,
    },
    maintenanceActivitySupervisedBy: {
      type: String,
    },
    invoiceNumber: {
      type: Number,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    parts: [
      {
        partNumber: { type: Number },
        materialsUsed: { type: String },
        quantity: { type: Number },
        cost: { type: Number },
        warranty: { type: String, enum: ["Yes", "No"] },
      },
    ],
  },
  { timestamp: true }
);

const Service_Maintenance = mongoose.model(
  "Service_Maintenance",
  service_MaintenanceSchema
);
export default Service_Maintenance;
