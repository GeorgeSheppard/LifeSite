import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/app-layout";
import RecipesPage from "./pages/food/RecipesPage";

// Lazy load non-critical routes for code splitting
const RecipeFormPage = lazy(() => import("./pages/food/RecipeFormPage"));
const MealPlannerPage = lazy(() => import("./pages/food/MealPlannerPage"));
const ShoppingListPage = lazy(() => import("./pages/food/ShoppingListPage"));

export function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Redirect / to /food */}
        <Route path="/" element={<Navigate to="/food" replace />} />

        {/* Food routes - RecipesPage is not lazy loaded for instant initial load */}
        <Route path="/food" element={<RecipesPage />} />
        <Route
          path="/food/:recipeUuid"
          element={
            <Suspense fallback={null}>
              <RecipeFormPage />
            </Suspense>
          }
        />
        <Route
          path="/food/meal-planner"
          element={
            <Suspense fallback={null}>
              <MealPlannerPage />
            </Suspense>
          }
        />
        <Route
          path="/food/shopping-list"
          element={
            <Suspense fallback={null}>
              <ShoppingListPage />
            </Suspense>
          }
        />
      </Routes>
    </AppLayout>
  );
}
