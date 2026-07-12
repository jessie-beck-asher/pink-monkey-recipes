import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../data/auth-context";
import RecipeForm from "../components/RecipeForm";

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function EditRecipe() {
  const { token, username } = useContext(AuthContext);
  const { name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`/api/get-recipe/${name}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      });
  }, [name]);

  async function handleSave(formData) {
    const updated = {
      ...recipe,
      ...formData,
      stories: formData.stories.map((s) => ({
        ...s,
        user: s.user || username || "Family",
      })),
      alternatives: formData.alternatives.map((a) => ({
        ...a,
        user: a.user || username || "Family",
      })),
    };

    const response = await fetch(`/api/edit-recipe/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "We couldn't save your changes. Please try again.");
    }

    navigate(`/recipe/${toSlug(formData.title)}`);
  }

  if (loading) {
    return (
      <div className="page">
        <p className="loading">Loading recipe…</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page">
        <Link className="back-link" to="/">
          ← Back to recipes
        </Link>
        <p className="loading">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Edit Recipe</h1>
      <RecipeForm
        initialRecipe={recipe}
        submitLabel="Save Changes"
        onSubmit={handleSave}
      />
    </div>
  );
}
