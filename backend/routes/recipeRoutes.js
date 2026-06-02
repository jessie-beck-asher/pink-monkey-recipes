import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipeByName, getTopRecipes, recordView } from '../controllers/recipeController.js';

const router = Router();

router.get('/recipes/top', getTopRecipes);
router.get('/recipes', getAllRecipes);
router.get('/get-recipe/:name', getRecipeByName);
router.post('/add-recipe', createRecipe);
router.post('/record-view/:name', recordView);

export default router;
