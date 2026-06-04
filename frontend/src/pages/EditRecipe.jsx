import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../data/auth-context";

import "./EditRecipe.css";

const emptyIngredient = () => ({ ingredient: "", measurement: "" });
const emptyDirection = () => ({ step: "" });
const emptyStory = () => ({ story: "" });
const emptyAlternative = () => ({ alternative: "" });

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function EditRecipe() {
  const { token, username } = useContext(AuthContext);
  const { name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [temperature, setTemperature] = useState("");
  const [ingredients, setIngredients] = useState([emptyIngredient()]);
  const [directions, setDirections] = useState([emptyDirection()]);
  const [stories, setStories] = useState([emptyStory()]);
  const [alternatives, setAlternatives] = useState([emptyAlternative()]);
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetch(`/api/get-recipe/${name}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRecipe(data);
        if (data) {
          setTitle(data.title ?? "");
          setDescription(data.description ?? "");
          setTemperature(data.temperature ?? "");
          setIngredients(
            data.ingredients?.length ? data.ingredients : [emptyIngredient()],
          );
          setDirections(
            data.directions?.length
              ? data.directions.map(({ step }) => ({ step }))
              : [emptyDirection()],
          );
          setStories(data.stories?.length ? data.stories : [{ ...emptyStory(), user: username }]);
          setAlternatives(
            data.alternatives?.length
              ? data.alternatives
              : [{ ...emptyAlternative(), user: username }],
          );
          setTags(data.tags?.join(", ") ?? "");
        }
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return (
      <div className="add-recipe-page">
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

  function handleSubmit(e) {
    e.preventDefault();
    const updated = {
      ...recipe,
      title,
      description,
      temperature,
      ingredients,
      directions: directions.map((d, i) => ({ sequence: i + 1, step: d.step })),
      stories: stories.filter((s) => s.story.trim()),
      alternatives: alternatives.filter((a) => a.alternative.trim()),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    fetch(`/api/edit-recipe/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    }).then((res) => {
      if (res.ok) navigate(`/recipe/${toSlug(title)}`);
    });
  }

  return (
    <div className="edit-recipe-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Edit Recipe</h1>
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
                  className="button-link remove-button"
                  type="button"
                  onClick={() => removeItem(ingredients, setIngredients, i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            className="button-link add-button"
            type="button"
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
                className="story-input"
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
            onClick={() => addItem(stories, setStories, () => ({ story: "", user: username }))}
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
                  type="button"
                  className="button-link remove-button"
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
              addItem(alternatives, setAlternatives, () => ({ alternative: "", user: username }))
            }
          >
            + Add Alternative
          </button>
        </fieldset>

        <label>
          <span>Tags (comma-separated, improves search results)</span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. dessert, cookies, family recipe"
          />
        </label>

        <button type="submit" className="button-link save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}
