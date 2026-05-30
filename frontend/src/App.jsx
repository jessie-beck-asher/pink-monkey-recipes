import "./App.css";
import HomePage from "./pages/HomePage";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import { AuthContext, useAuth } from "./data/auth-context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

function App() {
  function handleSkip(e) {
    e.preventDefault();
    const main = document.getElementById("main-content");
    const focusable = main?.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }

  return (
    <AuthContext.Provider value={useAuth()}>
      <Router>
        <a href="#main-content" className="skip-to-main" onClick={handleSkip}>
          Skip to Main Content
        </a>
        <Header />
        <main id="main-content" className="content-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:name" element={<RecipeDetails />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:name/edit" element={<EditRecipe />} />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
