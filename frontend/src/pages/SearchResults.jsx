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
    <div className="search-results page page-wide">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <h1 className="search-results-heading">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "All Recipes"}
      </h1>
      {loading ? (
        <p className="loading">Loading recipes…</p>
      ) : recipes.length === 0 ? (
        <div className="no-results">
          <p>We couldn&rsquo;t find any recipes for &ldquo;{query}&rdquo;.</p>
          <Link to="/search" className="btn btn-quiet">
            Browse all recipes instead
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
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
