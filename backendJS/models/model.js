import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    field1: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Model2",
    },
    field2: {
      type: String,
      enum: ["value1", "value2", "value3"],
      required: true,
      default: "value1",
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    },
    field3: {
      type: Number,
      required: true,
      default: 0,
      max: 5,
      min: 0,
    },
    field3: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Model = mongoose.model("Model", modelSchema);

export default Model;
