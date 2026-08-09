import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    lrnNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    gradeLevel: { type: Number, required: true, min: 7, max: 12 },
    accountStatus: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["student", "representative"],
      default: "student",
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      default: null,
    },
    promotedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    promotedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

StudentSchema.index(
  { party: 1 },
  { partialFilterExpression: { role: "representative" } },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
