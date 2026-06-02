import { Link } from "react-router-dom";
import "./RecipeCard.css";

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function RecipeCard({ title, description }) {
  return (
    <Link to={`/recipe/${toSlug(title)}`} className="recipe-card-link">
      <h3>{title}</h3>
    </Link>
  );
}
