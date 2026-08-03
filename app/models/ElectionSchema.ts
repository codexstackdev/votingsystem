import { Schema, model, models } from "mongoose";

const ElectionSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String },
  startAt:     { type: Date, required: true },
  endAt:       { type: Date, required: true },
  isActivated: { type: Boolean, default: false },
  createdBy:   { type: Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });

ElectionSchema.virtual("status").get(function () {
  const now = new Date();
  if (!this.isActivated) return "draft";
  if (now < this.startAt) return "upcoming";
  if (now > this.endAt) return "ended";
  return "active";
});
ElectionSchema.set("toJSON", { virtuals: true });

export default models.Election || model("Election", ElectionSchema);