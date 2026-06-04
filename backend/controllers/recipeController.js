import Recipe from "../models/recipe.js";
import HttpError from "../models/http-error.js";

export const getRecipeByName = async (req, res, next) => {
  const name = req.params.name.replace(/-/g, " ");
  let recipe;
  try {
    recipe = await Recipe.findOne({ title: new RegExp(`^${name}$`, "i") });
  } catch (err) {
    return next(
      new HttpError("Fetching recipe failed, please try again.", 500),
    );
  }

  if (!recipe) {
    return next(new HttpError("Recipe not found.", 404));
  }

  res.json(recipe.toObject({ getters: true }));
};

export const recordView = async (req, res, next) => {
  const name = req.params.name.replace(/-/g, " ");
  try {
    await Recipe.findOneAndUpdate(
      { title: new RegExp(`^${name}$`, "i") },
      { $inc: { weight: 1 } },
    );
  } catch (err) {
    return next(new HttpError("Recording view failed, please try again.", 500));
  }
  res.status(204).end();
};

export const getTopRecipes = async (req, res, next) => {
  let recipes;
  try {
    recipes = await Recipe.find({ weight: { $gt: 0 } })
      .sort({ weight: -1 })
      .limit(5);
  } catch (err) {
    return next(
      new HttpError("Fetching top recipes failed, please try again.", 500),
    );
  }
  res.json(recipes.map((r) => r.toObject({ getters: true })));
};

export const getAllRecipes = async (req, res, next) => {
  let recipes;
  try {
    recipes = await Recipe.find({});
  } catch (err) {
    return next(
      new HttpError("Fetching recipes failed, please try again.", 500),
    );
  }
  res.json(recipes.map((r) => r.toObject({ getters: true })));
};

export const getRecipeForEdit = async (req, res, next) => {
  const name = req.params.name.replace(/-/g, " ");
  let recipe;
  try {
    recipe = await Recipe.findOne({ title: new RegExp(`^${name}$`, "i") });
  } catch (err) {
    return next(
      new HttpError("Fetching recipe for edit failed, please try again.", 500),
    );
  }

  if (!recipe) {
    return next(new HttpError("Recipe not found.", 404));
  }

  res.json(recipe.toObject({ getters: true }));
};

export const updateRecipe = async (req, res, next) => {
  const name = req.params.name.replace(/-/g, " ");
  const {
    title,
    description,
    temperature,
    ingredients,
    directions,
    stories,
    alternatives,
    tags,
  } = req.body;

  let recipe;
  try {
    recipe = await Recipe.findOneAndUpdate(
      { title: new RegExp(`^${name}$`, "i") },
      { title, description, temperature, ingredients, directions, stories, alternatives, tags },
      { returnDocument: "after", runValidators: true },
    );
  } catch (err) {
    return next(new HttpError("Updating recipe failed, please try again.", 500));
  }

  if (!recipe) {
    return next(new HttpError("Recipe not found.", 404));
  }

  res.json(recipe.toObject({ getters: true }));
};

export const createRecipe = async (req, res, next) => {
  const {
    title,
    description,
    temperature,
    ingredients,
    directions,
    stories,
    alternatives,
    tags,
  } = req.body;

  const recipe = new Recipe({
    title,
    description,
    temperature,
    ingredients,
    directions,
    stories,
    alternatives,
    tags,
  });

  try {
    await recipe.save();
  } catch (err) {
    return next(
      new HttpError("Creating recipe failed, please try again.", 500),
    );
  }

  res.status(201).json({ recipe: recipe.toObject({ getters: true }) });
};
