import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema({
  election: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
  position: { type: Schema.Types.ObjectId, ref: "Position", required: true, index: true },
  party:    { type: Schema.Types.ObjectId, ref: "Party", required: true },
  student:  { type: Schema.Types.ObjectId, ref: "Student", required: true },
  platform: { type: String, required: true },
  status:      { type: String, enum: ["approved", "disqualified"], default: "approved" },
  submittedBy: { type: Schema.Types.ObjectId, ref: "Student", required: true },
}, { timestamps: true });

CandidateSchema.index({ election: 1, position: 1 });

export default models.Candidate || model("Candidate", CandidateSchema);