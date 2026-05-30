import { useParams, Link } from "react-router-dom";
import DUMMY_RECIPES from "../../DUMMY_RECIPES";
import "./RecipeDetails.css";

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function RecipeDetails() {
  const { name } = useParams();
  const recipe = DUMMY_RECIPES.find((r) => toSlug(r.title) === name);

  if (!recipe) {
    return (
      <div className="recipe-details recipe-not-found">
        <p>Recipe not found.</p>
        <Link to="/">Back to recipes</Link>
      </div>
    );
  }

  return (
    <div className="recipe-details">
      <Link to="/" className="back-link">← Back to recipes</Link>
      <Link to={`/recipe/${name}/edit`} className="edit-link">Edit Recipe</Link>

      <h1 className="recipe-title">{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>

      {recipe.tags?.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="recipe-tag">{tag}</span>
          ))}
        </div>
      )}

      {recipe.temperature && (
        <p className="recipe-temperature">Temperature: <strong>{recipe.temperature}</strong></p>
      )}

      <section className="recipe-section">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients.map(({ ingredient, measurement }) => (
            <li key={ingredient}>
              <span className="measurement">{measurement}</span> {ingredient}
            </li>
          ))}
        </ul>
      </section>

      <section className="recipe-section">
        <h2>Directions</h2>
        <ol className="directions-list">
          {recipe.directions
            .sort((a, b) => a.sequence - b.sequence)
            .map(({ sequence, step }) => (
              <li key={sequence}>{step}</li>
            ))}
        </ol>
      </section>

      {recipe.alternatives?.length > 0 && (
        <section className="recipe-section">
          <h2>Variations</h2>
          <ul className="alternatives-list">
            {recipe.alternatives.map(({ alternative }, i) => (
              <li key={i}>
                <strong>{alternative.user}:</strong> {alternative.alternative}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.stories?.length > 0 && (
        <section className="recipe-section recipe-stories">
          <h2>Stories</h2>
          {recipe.stories.map(({ story }, i) => (
            <div key={i}>
              <strong>{story.user}:</strong>
              <p>{story.story}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
