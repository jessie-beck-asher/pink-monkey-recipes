import { Link } from "react-router-dom";
import "./HomePage.css";
import RecipeCard from "../components/RecipeCard";
import DUMMY_RECIPES from "../../DUMMY_RECIPES";

export default function HomePage() {
  return (
    <div className="home-page">
      <input
        type="search"
        placeholder="Search recipes..."
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <Link to="/add-recipe">Add Recipe</Link>
      {DUMMY_RECIPES.map((recipe, index) => (
        <RecipeCard
          key={index}
          title={recipe.title}
          description={recipe.description}
        />
      ))}
    </div>
  );
}
