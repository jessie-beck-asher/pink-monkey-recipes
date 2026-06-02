import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config({ path: "./local.env" });

const app = express();
app.use(express.json());

app.use("/api", recipeRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred." });
});

// function toSlug(title) {
//   return title.toLowerCase().replace(/\s+/g, "-");
// }

// app.get("/api/recipes", (req, res) => {
//   res.json(DUMMY_RECIPES);
// });

// app.get("/api/recipes/:name", (req, res) => {
//   const recipe = DUMMY_RECIPES.find((r) => toSlug(r.title) === req.params.name);
//   if (!recipe) {
//     return res.status(404).json({ message: "Recipe not found" });
//   }
//   res.json(recipe);
// });

// app.put("/api/recipes/:name", (req, res) => {
//   const index = DUMMY_RECIPES.findIndex(
//     (r) => toSlug(r.title) === req.params.name,
//   );
//   if (index === -1) {
//     return res.status(404).json({ message: "Recipe not found" });
//   }
//   DUMMY_RECIPES[index] = req.body;
//   res.json(DUMMY_RECIPES[index]);
// });

// app.listen(3001, () => console.log("Server running on http://localhost:3001"));
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
