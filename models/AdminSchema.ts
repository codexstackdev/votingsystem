import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema({
  username:     { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  fullName:     { type: String, required: true },
  role:         { type: String, enum: ["superadmin", "staff"], default: "staff" },
}, { timestamps: true });

export default models.Admin || model("Admin", AdminSchema);