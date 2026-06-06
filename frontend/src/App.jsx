import React, { Suspense } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { AuthContext, useAuth } from "./data/auth-context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";

const RecipeDetails = React.lazy(() => import("./pages/RecipeDetails"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const AddRecipe = React.lazy(() => import("./pages/AddRecipe"));
const EditRecipe = React.lazy(() => import("./pages/EditRecipe"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  function handleSkip(e) {
    e.preventDefault();
    const main = document.getElementById("main-content");
    const focusable = main?.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
        <main id="main-content">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/recipe/:name" element={<RecipeDetails />} />
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/recipe/:name/edit" element={<EditRecipe />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
