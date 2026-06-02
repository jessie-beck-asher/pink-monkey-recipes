import mongoose from "mongoose";

const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [
    {
      ingredient: { type: String, required: true },
      measurement: { type: String, required: true },
    },
  ],
  directions: [
    {
      sequence: { type: Number, required: true },
      step: { type: String, required: true },
    },
  ],
  temperature: { type: String },
  stories: [
    {
      user: { type: String, required: true },
      story: { type: String, required: true },
    },
  ],
  alternatives: [
    {
      user: { type: String, required: true },
      alternative: { type: String, required: true },
    },
  ],
  tags: [{ type: String }],
  weight: { type: Number, default: 0 },
});

export default mongoose.model("Recipe", recipeSchema);
