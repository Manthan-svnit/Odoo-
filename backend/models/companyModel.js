import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String },
  defaultCurrency: { type: String, default: "USD" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvalRules: {
    percentageThreshold: { type: Number, default: 60 },
    ruleType: { type: String, enum: ["percentage", "specific", "hybrid"], default: "percentage" }
  },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
