import { Router } from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeByName,
  getTopRecipes,
  recordView,
  updateRecipe,
} from "../controllers/recipeController.js";
import authCheck from "../middleware/authCheck.js";

const router = Router();

router.get("/recipes/top", getTopRecipes); // gets the top 5 recipes by weight (views)
router.get("/recipes", getAllRecipes); // gets all recipes (for listing on homepage)
router.get("/get-recipe/:name", getRecipeByName); // gets a single recipe by name (for viewing details)
router.put("/edit-recipe/:name", authCheck, updateRecipe); // updates an existing recipe by name (requires auth)
router.post("/add-recipe", authCheck, createRecipe); // creates a new recipe (for adding a new recipe)
router.post("/record-view/:name", recordView); // records a view for a recipe (for incrementing weight when a recipe is viewed)

export default router;
