import { Link } from "react-router-dom";
import "./Header.css";
import BananaIcon from "./BananaIcon";

function Header({ onSearch }) {
  return (
    <>
      <header>
        <Link to="/">
          <BananaIcon width={100} height={100} color="currentColor" />
        </Link>
        <div>
          {/* <Link to="/login" className="button-link">
            Login
          </Link> */}
          <Link to="/add-recipe" className="button-link">
            Add Recipe
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
