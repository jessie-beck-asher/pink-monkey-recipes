import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import RecipeCard from "../components/RecipeCard";
import MonkeyIcon from "../components/MonkeyIcon";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/recipes/top")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Failed to load top recipes:", err));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="home-page page page-wide">
      <section className="home-hero">
        <MonkeyIcon width={250} height={140} color="var(--text)" />
        <h1>Welcome to the family cookbook</h1>
        <p className="home-tagline">
          Every recipe here comes with a story. Find an old favorite, or add
          one of your own.
        </p>
        <form className="home-search" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Search for a recipe…"
            aria-label="Search recipes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <Link to="/search" className="browse-all-link">
          or browse all recipes →
        </Link>
      </section>

      {recipes.length > 0 && (
        <section className="home-popular">
          <h2>Family favorites right now</h2>
          <div className="recipe-grid">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                description={recipe.description}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
