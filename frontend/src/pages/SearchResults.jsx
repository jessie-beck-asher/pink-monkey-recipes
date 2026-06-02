import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./SearchResults.css";
import RecipeCard from "../components/RecipeCard";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!query) {
          setRecipes(data);
        } else {
          const q = query.toLowerCase();
          const filtered = data.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              (r.tags && r.tags.some((tag) => tag.toLowerCase().includes(q))),
          );
          setRecipes(filtered);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recipes:", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-results">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <h1 className="search-results-heading">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "All Recipes"}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="no-results">
          No recipes found for &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="search-recipe-cards">
          {recipes.map((recipe, i) => (
            <RecipeCard
              key={i}
              title={recipe.title}
              description={recipe.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
