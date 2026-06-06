import dotenv from "dotenv";
import express from "express";
import dbConnect from "./utils/dbConnect.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

const envFile =
  process.env.NODE_ENV === "production" ? "./production.env" : "./local.env";
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api", recipeRoutes);
app.use("/api", memberRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred." });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT);
}

export default app;
