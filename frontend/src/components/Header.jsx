import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import BananaIcon from "./BananaIcon";
import { AuthContext } from "../data/auth-context";

function Header({ onSearch }) {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <header>
        <Link to="/">
          <BananaIcon width={100} height={100} color="currentColor" />
        </Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link to="/add-recipe" className="button-link">
                Add Recipe
              </Link>
              <button className="button-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="button-link">
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
