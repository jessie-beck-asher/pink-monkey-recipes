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
    <div className="home-page">
      <div className="monkey-wrapper">
        <MonkeyIcon height="50vh" width="100vw" color="currentColor" />
      </div>

      <div className="search-wrap">
        <form onSubmit={handleSearch}>
          <label>
            <input
              type="search"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </form>
        <Link to="/search" className="back-link">
          Browse All Recipes →
        </Link>
      </div>

      {recipes.length > 0 && (
        <>
          <div className="heading-wrap">
            <h2>Recently Popular...</h2>
          </div>
          <div className="recipe-cards">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                description={recipe.description}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
