import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  details: Object,
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
