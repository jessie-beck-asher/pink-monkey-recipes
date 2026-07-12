import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../data/auth-context";
import "./RecipeDetails.css";

export default function RecipeDetails() {
  const { name } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ingredients");
  const viewRecorded = useRef(false);

  useEffect(() => {
    fetch(`/api/get-recipe/${name}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      });

    if (!viewRecorded.current) {
      viewRecorded.current = true;
      fetch(`/api/record-view/${name}`, { method: "POST" }).catch(() => {});
    }
  }, [name]);

  if (loading) {
    return (
      <div className="recipe-details page">
        <p className="loading">Loading recipe…</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-details page">
        <Link className="back-link" to="/">
          ← Back to recipes
        </Link>
        <p className="loading">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="recipe-details page">
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <div className="recipe-title-row">
        <h1 className="recipe-title">{recipe.title}</h1>
        {isLoggedIn && (
          <Link to={`/recipe/${name}/edit`} className="btn btn-quiet">
            ✏️ Edit
          </Link>
        )}
      </div>

      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      {recipe.temperature && (
        <p className="recipe-meta">
          Oven: <strong>{recipe.temperature}</strong>
        </p>
      )}

      <div className="recipe-tabs" role="tablist">
        <button
          className={`recipe-tab${activeTab === "ingredients" ? " active" : ""}`}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients
        </button>
        <button
          className={`recipe-tab${activeTab === "directions" ? " active" : ""}`}
          onClick={() => setActiveTab("directions")}
        >
          Directions
        </button>
      </div>

      <section className="recipe-section recipe-tab-content card">
        {activeTab === "ingredients" ? (
          <ul className="ingredients-list">
            {recipe.ingredients.map(({ ingredient, measurement }) => (
              <li key={ingredient}>
                <span className="ingredient-name">{ingredient}</span>
                {measurement && (
                  <span className="ingredient-amount">{measurement}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ol className="directions-list">
            {recipe.directions
              .sort((a, b) => a.sequence - b.sequence)
              .map(({ sequence, step }) => (
                <li key={sequence}>
                  <span className="step-badge" aria-hidden="true">
                    {sequence}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
          </ol>
        )}
      </section>

      {recipe.alternatives?.length > 0 && (
        <section className="recipe-section">
          <h2>Variations</h2>
          <ul className="alternatives-list">
            {recipe.alternatives.map(({ user, alternative }, i) => (
              <li key={i}>
                <strong>{user}:</strong> {alternative}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLoggedIn && recipe.stories?.length > 0 && (
        <section className="recipe-section recipe-stories">
          <h2>Stories</h2>
          {recipe.stories.map(({ user, story }, i) => (
            <blockquote key={i} className="story-quote">
              <p>{story}</p>
              <footer>— {user}</footer>
            </blockquote>
          ))}
        </section>
      )}

      {recipe.tags?.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
