import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import BananaIcon from "./BananaIcon";
import { AuthContext } from "../data/auth-context";

function Header() {
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <BananaIcon width={34} height={34} color="var(--banana)" />
        <span className="brand-name">Pink Monkey Recipes</span>
      </Link>
      <nav className="header-actions" aria-label="Account">
        {isLoggedIn ? (
          <>
            <span className="user-chip">Hi, {username}!</span>
            <Link to="/add-recipe" className="btn btn-primary">
              + Add Recipe
            </Link>
            <button type="button" className="btn btn-quiet" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
