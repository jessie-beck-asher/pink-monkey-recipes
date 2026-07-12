import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../data/auth-context";
import RecipeForm from "../components/RecipeForm";

export default function AddRecipe() {
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSave(recipe) {
    const withUsers = {
      ...recipe,
      stories: recipe.stories.map((s) => ({
        ...s,
        user: s.user || username || "Family",
      })),
      alternatives: recipe.alternatives.map((a) => ({
        ...a,
        user: a.user || username || "Family",
      })),
    };

    const response = await fetch("/api/add-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(withUsers),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "We couldn't save the recipe. Please try again.");
    }

    navigate("/");
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <h1>Add a Recipe</h1>
      <RecipeForm
        draftKey="pink-monkey-add-recipe-draft"
        submitLabel="Save Recipe"
        onSubmit={handleSave}
      />
    </div>
  );
}
