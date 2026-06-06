import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import recipeRoutes from "./routes/recipeRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

const envFile =
  process.env.NODE_ENV === "production" ? "./production.env" : "./local.env";
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());

app.use("/api", recipeRoutes);
app.use("/api", memberRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred." });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
