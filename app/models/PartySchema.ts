import { Schema, model, models } from "mongoose";

const PartySchema = new Schema(
  {
    election: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    color: { type: String, default: "#1E3A8A" },
    logoUrl: { type: String },
    logoId: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true },
);

export default models.Party || model("Party", PartySchema);
