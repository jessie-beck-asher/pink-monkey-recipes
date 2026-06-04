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
      <div className="recipe-details">
        <p>Loading...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-details">
        <Link className="back-link" to="/">
          ← Back to recipes
        </Link>
        <p className="recipe-not-found">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="recipe-details">
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <h1 className="recipe-title">{recipe.title}</h1>

      {recipe.temperature && (
        <p>
          Temperature: <strong>{recipe.temperature}</strong>
        </p>
      )}

      <div className="recipe-tabs">
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

      <section className="recipe-section recipe-tab-content">
        {activeTab === "ingredients" ? (
          <ul className="ingredients-list">
            {recipe.ingredients.map(({ ingredient, measurement }) => (
              <li key={ingredient}>
                <span className="measurement">
                  {ingredient} ({measurement})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ol className="directions-list">
            {recipe.directions
              .sort((a, b) => a.sequence - b.sequence)
              .map(({ sequence, step }) => (
                <li key={sequence}>
                  <span>
                    {sequence}. {step}
                  </span>
                </li>
              ))}
          </ol>
        )}
      </section>

      {isLoggedIn && (
        <Link to={`/recipe/${name}/edit`} className="edit-link button-link">
          Edit Recipe
        </Link>
      )}

      {recipe.alternatives?.length > 0 && (
        <section className="recipe-section">
          <h2>Variations</h2>
          <ul className="alternatives-list">
            {recipe.alternatives.map(({ user, alternative }, i) => (
              <li key={i}>
                <span>
                  <strong>{user}:</strong> {alternative}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLoggedIn && recipe.stories?.length > 0 && (
        <section className="recipe-section recipe-stories">
          <h2>Stories</h2>
          {recipe.stories.map(({ user, story }, i) => (
            <div key={i}>
              <span>
                <strong>{user}:</strong>
              </span>
              <p>{story}</p>
            </div>
          ))}
        </section>
      )}
      {recipe.tags?.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="recipe-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
