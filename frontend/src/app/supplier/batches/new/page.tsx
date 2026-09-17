"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { listIngredients } from "@/lib/api/catalog";
import { createBatch } from "@/lib/api/suppliers";
import type { Ingredient } from "@/lib/api/types";

export default function NewBatchPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientId, setIngredientId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [sowingDate, setSowingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listIngredients().then((res) => {
      setIngredients(res.results);
      if (res.results.length > 0) {
        setIngredientId(res.results[0].id);
        setUnit(res.results[0].unit_default);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ingredientId) return;
    setError(null);
    setLoading(true);
    try {
      const batch = await createBatch({
        ingredient: ingredientId,
        quantity,
        unit,
        sowing_date: sowingDate || undefined,
        harvest_date: harvestDate,
      });
      router.push(`/supplier/batches/${batch.id}`);
    } catch {
      setError("Could not create batch. Check the harvest date and quantity.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-heading text-2xl text-foreground">New harvest batch</h1>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Ingredient">
              <Select
                value={ingredientId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setIngredientId(id);
                  const ing = ingredients.find((i) => i.id === id);
                  if (ing) setUnit(ing.unit_default);
                }}
              >
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>{i.category_name} · {i.name}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity"><Input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field>
              <Field label="Unit"><Input required value={unit} onChange={(e) => setUnit(e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sowing date"><Input type="date" value={sowingDate} onChange={(e) => setSowingDate(e.target.value)} /></Field>
              <Field label="Harvest date"><Input type="date" required value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} /></Field>
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>Create batch</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
