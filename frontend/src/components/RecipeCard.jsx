import { Link } from "react-router-dom";
import "./RecipeCard.css";

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function RecipeCard({ title, description }) {
  return (
    <Link to={`/recipe/${toSlug(title)}`} className="recipe-card">
      <h3 className="recipe-card-title">{title}</h3>
      {description && (
        <p className="recipe-card-description">{description}</p>
      )}
    </Link>
  );
}
