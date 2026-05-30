import { Link } from "react-router-dom";
import "./Header.css";

function Header({ onSearch }) {
  return (
    <>
      <header>
        <Link to="/" tabIndex="0">
          <h1 className="header-logo-text">Pink Monkey Recipes</h1>
        </Link>
      </header>
    </>
  );
}

export default Header;
