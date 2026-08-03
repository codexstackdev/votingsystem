import { Schema, model, models } from "mongoose";

const BallotSchema = new Schema({
  election: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
  student:  { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  votes: [{
    position:  { type: Schema.Types.ObjectId, ref: "Position", required: true },
    candidate: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  }],
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

BallotSchema.index({ election: 1, student: 1 }, { unique: true });

export default models.Ballot || model("Ballot", BallotSchema);