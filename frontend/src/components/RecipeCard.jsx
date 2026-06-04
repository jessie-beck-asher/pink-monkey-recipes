import { Link } from "react-router-dom";
import "./RecipeCard.css";

function toSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function RecipeCard({ title, description }) {
  return (
    <Link to={`/recipe/${toSlug(title)}`} className="recipe-card-link">
      <h3 className="recipe-card-title">
        {title.length > 30 ? title.slice(0, 30) + "..." : title}
      </h3>
    </Link>
  );
}
