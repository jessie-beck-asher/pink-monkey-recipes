import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../data/auth-context";

import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      login(data.username, data.token, data.expiresIn);
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page page">
      <div className="login-card card">
        <h1>Family Log In</h1>
        <p className="login-text">
          Only family members can log in — but everyone is welcome to browse
          the recipes!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="error-banner" role="alert">
              <strong>We couldn&rsquo;t log you in.</strong> {error}{" "}
              Double-check your username and password, then try again.
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
