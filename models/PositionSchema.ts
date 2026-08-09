import { Schema, model, models } from "mongoose";

const PositionSchema = new Schema({
  election: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
  title:    { type: String, required: true },
  order:    { type: Number, default: 0},
  maxVotes: { type: Number, default: 1 },
}, { timestamps: true });

PositionSchema.index({ election: 1, order: 1 });

export default models.Position || model("Position", PositionSchema);