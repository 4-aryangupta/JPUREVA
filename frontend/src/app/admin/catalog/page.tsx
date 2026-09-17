"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { mediaUrl } from "@/lib/api/client";
import { createCategory, createItem, deleteItem, listAdminCategories, listAdminItems } from "@/lib/api/admin";
import type { Batch, Category } from "@/lib/api/types";

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Batch[]>([]);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  function refresh() {
    listAdminCategories().then((res) => {
      setCategories(res.results);
      setCategoryId((prev) => prev ?? res.results[0]?.id ?? null);
    });
    listAdminItems().then(setItems);
  }

  useEffect(refresh, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      await createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      refresh();
    } catch {
      setError("Could not create category. It may already exist.");
    } finally {
      setCategoryLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !name.trim() || !price || !stock) return;
    setError(null);
    setLoading(true);
    try {
      await createItem({
        name: name.trim(),
        category: categoryId,
        unit_default: unit,
        price_per_unit: price,
        available_quantity: stock,
        expected_min_harvest_days: minDays ? Number(minDays) : null,
        expected_max_harvest_days: maxDays ? Number(maxDays) : null,
        image,
      });
      setName("");
      setPrice("");
      setStock("");
      setMinDays("");
      setMaxDays("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch {
      setError("Could not create item. Check the fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: Batch) {
    if (!window.confirm(`Remove ${item.ingredient_name} from the marketplace?`)) return;
    await deleteItem(item.id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Catalog</h1>
        <p className="text-sm text-foreground-secondary">
          Items added here go live on the marketplace immediately — no supplier or lab step needed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add item</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface-muted text-foreground-tertiary hover:border-primary-light hover:text-primary"
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus size={22} />
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex-1 space-y-4">
                  <Field label="Category">
                    <Select value={categoryId ?? ""} onChange={(e) => setCategoryId(Number(e.target.value))}>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Name">
                    <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tomato" />
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price per unit (₹)">
                  <Input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
                </Field>
                <Field label="Unit">
                  <Input required value={unit} onChange={(e) => setUnit(e.target.value)} />
                </Field>
              </div>
              <Field label="Stock quantity">
                <Input type="number" step="0.01" required value={stock} onChange={(e) => setStock(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Min harvest days (optional)">
                  <Input type="number" value={minDays} onChange={(e) => setMinDays(e.target.value)} />
                </Field>
                <Field label="Max harvest days (optional)">
                  <Input type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} />
                </Field>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" className="w-full" loading={loading} disabled={!categories.length}>
                Add item
              </Button>
              {!categories.length && (
                <p className="text-xs text-foreground-secondary">Add a category first.</p>
              )}
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add category</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <Field label="Name">
                <Input
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Grains"
                />
              </Field>
              <Button type="submit" variant="outline" className="w-full" loading={categoryLoading}>
                Add category
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items ({items.length})</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {items.map((item) => {
            const photo = item.photos.find((p) => p.image)?.image;
            return (
              <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(photo) ?? undefined} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus size={16} className="text-foreground-tertiary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.ingredient_name}</div>
                    <div className="text-xs text-foreground-secondary">
                      ₹{item.price_per_unit} / {item.unit} · Stock: {item.available_quantity}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-foreground-tertiary transition-colors hover:text-danger"
                  aria-label={`Remove ${item.ingredient_name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {!items.length && <p className="text-sm text-foreground-secondary">No items yet.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
