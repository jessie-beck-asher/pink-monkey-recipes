import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../data/auth-context";
import "./EditRecipe.css";

const emptyIngredient = () => ({ ingredient: "", measurement: "" });
const emptyDirection = () => ({ step: "" });
const emptyStory = () => ({ user: "", story: "" });
const emptyAlternative = () => ({ user: "", alternative: "" });

export default function AddRecipe() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [temperature, setTemperature] = useState("");
  const [ingredients, setIngredients] = useState([emptyIngredient()]);
  const [directions, setDirections] = useState([emptyDirection()]);
  const [stories, setStories] = useState([emptyStory()]);
  const [alternatives, setAlternatives] = useState([emptyAlternative()]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);

  function updateList(list, setList, index, field, value) {
    const updated = list.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setList(updated);
  }

  function addItem(list, setList, empty) {
    setList([...list, empty()]);
  }

  function removeItem(list, setList, index) {
    setList(list.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const recipe = {
      title,
      description,
      temperature,
      ingredients,
      directions: directions.map((d, i) => ({ sequence: i + 1, step: d.step })),
      stories: stories
        .filter((s) => s.story.trim())
        .map((s) => ({ ...s, user: "Jessie" })),
      alternatives: alternatives
        .filter((a) => a.alternative.trim())
        .map((a) => ({ ...a, user: "Jessie" })),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch("/api/add-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save recipe.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="add-recipe-page">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <h1>Add Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Temperature</span>
          <input
            type="text"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g. 350°F (175°C)"
          />
        </label>

        <fieldset>
          <legend>Ingredients</legend>
          {ingredients.map((item, i) => (
            <div key={i} className="list-row">
              <input
                type="text"
                placeholder="Ingredient"
                value={item.ingredient}
                onChange={(e) =>
                  updateList(
                    ingredients,
                    setIngredients,
                    i,
                    "ingredient",
                    e.target.value,
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Measurement"
                value={item.measurement}
                onChange={(e) =>
                  updateList(
                    ingredients,
                    setIngredients,
                    i,
                    "measurement",
                    e.target.value,
                  )
                }
                required
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="button-link remove-button"
                  onClick={() => removeItem(ingredients, setIngredients, i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="button-link add-button"
            onClick={() =>
              addItem(ingredients, setIngredients, emptyIngredient)
            }
          >
            + Add Ingredient
          </button>
        </fieldset>

        <fieldset>
          <legend>Directions</legend>
          {directions.map((item, i) => (
            <div key={i} className="list-row">
              <span>{i + 1}.</span>
              <textarea
                placeholder="Step"
                value={item.step}
                onChange={(e) =>
                  updateList(
                    directions,
                    setDirections,
                    i,
                    "step",
                    e.target.value,
                  )
                }
                required
              />
              {directions.length > 1 && (
                <button
                  type="button"
                  className="button-link remove-button"
                  onClick={() => removeItem(directions, setDirections, i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="button-link add-button"
            onClick={() => addItem(directions, setDirections, emptyDirection)}
          >
            + Add Step
          </button>
        </fieldset>

        <fieldset>
          <legend>Stories</legend>
          {stories.map((item, i) => (
            <div key={i} className="list-row">
              <textarea
                placeholder="Story"
                value={item.story}
                onChange={(e) =>
                  updateList(stories, setStories, i, "story", e.target.value)
                }
              />
              {stories.length > 1 && (
                <button
                  type="button"
                  className="button-link remove-button"
                  onClick={() => removeItem(stories, setStories, i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="button-link add-button"
            onClick={() => addItem(stories, setStories, emptyStory)}
          >
            + Add Story
          </button>
        </fieldset>

        <fieldset>
          <legend>Alternatives</legend>
          {alternatives.map((item, i) => (
            <div key={i} className="list-row">
              <textarea
                placeholder="Alternative"
                value={item.alternative}
                onChange={(e) =>
                  updateList(
                    alternatives,
                    setAlternatives,
                    i,
                    "alternative",
                    e.target.value,
                  )
                }
              />
              {alternatives.length > 1 && (
                <button
                  className="button-link remove-button"
                  type="button"
                  onClick={() => removeItem(alternatives, setAlternatives, i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="button-link add-button"
            onClick={() =>
              addItem(alternatives, setAlternatives, emptyAlternative)
            }
          >
            + Add Alternative
          </button>
        </fieldset>

        <label>
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. dessert, cookies, family recipe"
          />
        </label>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button-link">
          Save Recipe
        </button>
      </form>
    </div>
  );
}
