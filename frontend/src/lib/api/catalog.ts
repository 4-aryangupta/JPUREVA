import { apiFetch } from "./client";
import type { Category, Ingredient, Paginated } from "./types";

export function listCategories() {
  return apiFetch<Paginated<Category>>("/catalog/categories/");
}

export function listIngredients(categorySlug?: string) {
  const qs = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  return apiFetch<Paginated<Ingredient>>(`/catalog/ingredients/${qs}`);
}
