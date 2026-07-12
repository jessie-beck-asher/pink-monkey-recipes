import { useEffect, useRef, useState } from "react";
import "./RecipeForm.css";

const emptyIngredient = () => ({ ingredient: "", measurement: "" });
const emptyDirection = () => ({ step: "" });
const emptyStory = () => ({ story: "" });
const emptyAlternative = () => ({ alternative: "" });

const blankForm = () => ({
  title: "",
  description: "",
  temperature: "",
  ingredients: [emptyIngredient()],
  directions: [emptyDirection()],
  stories: [emptyStory()],
  alternatives: [emptyAlternative()],
  tags: "",
});

function normalize(recipe) {
  return {
    title: recipe.title ?? "",
    description: recipe.description ?? "",
    temperature: recipe.temperature ?? "",
    ingredients: recipe.ingredients?.length
      ? recipe.ingredients
      : [emptyIngredient()],
    directions: recipe.directions?.length
      ? recipe.directions.map(({ step }) => ({ step: step ?? "" }))
      : [emptyDirection()],
    stories: recipe.stories?.length ? recipe.stories : [emptyStory()],
    alternatives: recipe.alternatives?.length
      ? recipe.alternatives
      : [emptyAlternative()],
    tags: recipe.tags?.join(", ") ?? "",
  };
}

function readDraft(draftKey) {
  if (!draftKey) return null;
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey));
    return draft?.title || draft?.ingredients ? draft : null;
  } catch {
    return null;
  }
}

export default function RecipeForm({
  initialRecipe = null,
  submitLabel = "Save Recipe",
  draftKey = null,
  onSubmit,
}) {
  const [initial] = useState(() => {
    if (initialRecipe) return { form: normalize(initialRecipe), fromDraft: false };
    const draft = readDraft(draftKey);
    return draft
      ? { form: { ...blankForm(), ...draft }, fromDraft: true }
      : { form: blankForm(), fromDraft: false };
  });

  const [form, setForm] = useState(initial.form);
  const [showDraftNotice, setShowDraftNotice] = useState(initial.fromDraft);
  const [dirty, setDirty] = useState(initial.fromDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef(null);
  const pendingFocus = useRef(null);

  // Keep a local draft so half-typed recipes survive accidental closes.
  useEffect(() => {
    if (!draftKey || !dirty) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(form));
      } catch {
        /* storage full or unavailable — the leave guard below still helps */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [form, dirty, draftKey]);

  // Warn before closing the tab with unsaved edits (edit mode has no draft).
  useEffect(() => {
    if (!dirty || draftKey) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, draftKey]);

  useEffect(() => {
    if (pendingFocus.current && formRef.current) {
      formRef.current.querySelector(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  });

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  }

  function updateItem(listName, index, field, value) {
    update({
      [listName]: form[listName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    });
  }

  function addItem(listName, empty, focusSelector) {
    update({ [listName]: [...form[listName], empty()] });
    if (focusSelector) pendingFocus.current = focusSelector;
  }

  function removeRow(listName, index, empty) {
    if (form[listName].length === 1) {
      update({ [listName]: [empty()] });
    } else {
      update({ [listName]: form[listName].filter((_, i) => i !== index) });
    }
  }

  function focusOrAdd(listName, index, empty, selectorPrefix) {
    const next = `[data-focus="${selectorPrefix}-${index + 1}"]`;
    if (index === form[listName].length - 1) {
      addItem(listName, empty, next);
    } else {
      formRef.current?.querySelector(next)?.focus();
    }
  }

  function handleIngredientKeyDown(e, i) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    focusOrAdd("ingredients", i, emptyIngredient, "ingredient");
  }

  function handleStepKeyDown(e, i) {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    focusOrAdd("directions", i, emptyDirection, "step");
  }

  function startFresh() {
    setForm(blankForm());
    setDirty(false);
    setShowDraftNotice(false);
    if (draftKey) localStorage.removeItem(draftKey);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const recipe = {
      title: form.title.trim(),
      description: form.description.trim(),
      temperature: form.temperature.trim(),
      ingredients: form.ingredients.filter(
        (x) => x.ingredient.trim() || x.measurement.trim(),
      ),
      directions: form.directions
        .filter((d) => d.step.trim())
        .map((d, i) => ({ sequence: i + 1, step: d.step })),
      stories: form.stories.filter((s) => s.story.trim()),
      alternatives: form.alternatives.filter((a) => a.alternative.trim()),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (recipe.ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }
    if (recipe.directions.length === 0) {
      setError("Please add at least one direction step.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(recipe);
      setDirty(false);
      if (draftKey) localStorage.removeItem(draftKey);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong saving the recipe. Your work is still here — please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} className="recipe-form" onSubmit={handleSubmit}>
      {showDraftNotice && (
        <div className="draft-notice" role="status">
          <span>Welcome back! We saved the recipe you were working on.</span>
          <button type="button" className="btn btn-quiet" onClick={startFresh}>
            Start fresh
          </button>
        </div>
      )}

      <section className="form-section card">
        <h2>
          <span className="section-number">1</span> The Basics
        </h2>
        <div className="field">
          <label htmlFor="recipe-title">Recipe name</label>
          <input
            id="recipe-title"
            type="text"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="e.g. Grandma's Banana Bread"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-description">Description</label>
          <textarea
            id="recipe-description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="A sentence or two about the dish."
            required
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-temperature">
            Oven temperature <span className="optional-tag">(optional)</span>
          </label>
          <input
            id="recipe-temperature"
            type="text"
            value={form.temperature}
            onChange={(e) => update({ temperature: e.target.value })}
            placeholder="e.g. 350°F (175°C)"
          />
        </div>
      </section>

      <section className="form-section card">
        <h2>
          <span className="section-number">2</span> Ingredients
        </h2>
        <p className="field-hint section-hint">
          Tip: press Enter to jump to the next ingredient.
        </p>
        {form.ingredients.map((item, i) => (
          <div key={i} className="list-row">
            <input
              type="text"
              className="ingredient-input"
              placeholder="Ingredient (e.g. flour)"
              aria-label={`Ingredient ${i + 1}`}
              data-focus={`ingredient-${i}`}
              value={item.ingredient}
              onChange={(e) =>
                updateItem("ingredients", i, "ingredient", e.target.value)
              }
              onKeyDown={(e) => handleIngredientKeyDown(e, i)}
            />
            <input
              type="text"
              className="measurement-input"
              placeholder="Amount (e.g. 2 cups)"
              aria-label={`Amount for ingredient ${i + 1}`}
              value={item.measurement}
              onChange={(e) =>
                updateItem("ingredients", i, "measurement", e.target.value)
              }
              onKeyDown={(e) => handleIngredientKeyDown(e, i)}
            />
            <button
              type="button"
              className="btn btn-danger remove-button"
              onClick={() => removeRow("ingredients", i, emptyIngredient)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() =>
            addItem(
              "ingredients",
              emptyIngredient,
              `[data-focus="ingredient-${form.ingredients.length}"]`,
            )
          }
        >
          + Add ingredient
        </button>
      </section>

      <section className="form-section card">
        <h2>
          <span className="section-number">3</span> Directions
        </h2>
        <p className="field-hint section-hint">
          Tip: press Enter to start the next step (Shift+Enter for a new line).
        </p>
        {form.directions.map((item, i) => (
          <div key={i} className="list-row">
            <span className="step-number" aria-hidden="true">
              {i + 1}
            </span>
            <textarea
              placeholder={`Step ${i + 1}`}
              aria-label={`Step ${i + 1}`}
              data-focus={`step-${i}`}
              value={item.step}
              onChange={(e) => updateItem("directions", i, "step", e.target.value)}
              onKeyDown={(e) => handleStepKeyDown(e, i)}
            />
            <button
              type="button"
              className="btn btn-danger remove-button"
              onClick={() => removeRow("directions", i, emptyDirection)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() =>
            addItem(
              "directions",
              emptyDirection,
              `[data-focus="step-${form.directions.length}"]`,
            )
          }
        >
          + Add step
        </button>
      </section>

      <section className="form-section card">
        <h2>
          <span className="section-number">4</span> Extras{" "}
          <span className="optional-tag">(all optional)</span>
        </h2>

        <fieldset className="extras-group">
          <legend>Stories</legend>
          <p className="field-hint section-hint">
            Share a memory that goes with this recipe.
          </p>
          {form.stories.map((item, i) => (
            <div key={i} className="list-row">
              <textarea
                placeholder="Once upon a time in Grandma's kitchen…"
                aria-label={`Story ${i + 1}`}
                value={item.story}
                onChange={(e) => updateItem("stories", i, "story", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger remove-button"
                onClick={() => removeRow("stories", i, emptyStory)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => addItem("stories", emptyStory)}
          >
            + Add story
          </button>
        </fieldset>

        <fieldset className="extras-group">
          <legend>Variations</legend>
          <p className="field-hint section-hint">
            Swaps or twists that also work — &ldquo;use pecans instead of
            walnuts&rdquo;.
          </p>
          {form.alternatives.map((item, i) => (
            <div key={i} className="list-row">
              <textarea
                placeholder="Variation"
                aria-label={`Variation ${i + 1}`}
                value={item.alternative}
                onChange={(e) =>
                  updateItem("alternatives", i, "alternative", e.target.value)
                }
              />
              <button
                type="button"
                className="btn btn-danger remove-button"
                onClick={() => removeRow("alternatives", i, emptyAlternative)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => addItem("alternatives", emptyAlternative)}
          >
            + Add variation
          </button>
        </fieldset>

        <div className="field">
          <label htmlFor="recipe-tags">Tags</label>
          <input
            id="recipe-tags"
            type="text"
            value={form.tags}
            onChange={(e) => update({ tags: e.target.value })}
            placeholder="e.g. dessert, cookies, family recipe"
          />
          <p className="field-hint">
            Separate with commas — tags help everyone find this recipe in
            search.
          </p>
        </div>
      </section>

      <div className="save-bar">
        {error && (
          <p className="error-banner save-error" role="alert">
            {error}
          </p>
        )}
        <div className="save-bar-inner">
          <span className="save-hint">
            {draftKey
              ? "We keep a draft on this device while you type."
              : dirty
                ? "You have unsaved changes."
                : ""}
          </span>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
          >
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
