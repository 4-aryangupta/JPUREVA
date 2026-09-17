"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  ShoppingBag,
  FlaskConical,
  Leaf,
  Truck,
  Sparkles,
  FileText,
  Plus,
  Minus,
  QrCode,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { listCategories } from "@/lib/api/catalog";
import { listProducts } from "@/lib/api/hotels";
import { useGuestCart } from "@/lib/store/guestCart";
import type { Batch, Category } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  truck: Truck,
  flask: FlaskConical,
};

export default function BrowsePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high">("recommended");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const { addItem, itemCount } = useGuestCart();

  useEffect(() => {
    listCategories().then((res) => setCategories(res.results));
  }, []);

  useEffect(() => {
    setLoading(true);
    listProducts({ category: activeCategory })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const getQuantity = (batch: Batch) => quantities[batch.id] ?? 1;
  const setQuantity = (batchId: string, val: number) => {
    const max = Number.parseFloat(products.find((p) => p.id === batchId)?.available_quantity ?? "9999") || 9999;
    setQuantities((prev) => ({ ...prev, [batchId]: Math.min(Math.max(val, 1), max) }));
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.ingredient_name.toLowerCase().includes(q) || p.supplier_name.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-low") {
      list.sort((a, b) => Number(a.price_per_unit) - Number(b.price_per_unit));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => Number(b.price_per_unit) - Number(a.price_per_unit));
    }
    return list;
  }, [products, searchQuery, sortBy]);

  function handleAdd(batch: Batch) {
    addItem(batch, getQuantity(batch));
    setJustAddedId(batch.id);
    setTimeout(() => setJustAddedId((cur) => (cur === batch.id ? null : cur)), 2000);
  }

  return (
    <div className="flex-1 space-y-8 pb-16">
      <header className="glass-panel sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary">
            <ShieldCheck size={28} className="text-primary" />
            <span>JPureva</span>
          </Link>
          <Link
            href="/cart"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-primary/25 bg-surface-muted px-4 py-2 text-xs font-bold text-primary shadow-soft transition-colors hover:bg-surface-2"
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-on-accent">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Browse verified ingredients
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
            Only lab-certified, listed batches appear here — every card links to its full NABL
            certificate and traceability record. Add what you need; you&apos;ll only need to log in
            as a hotel/restaurant when you&apos;re ready to check out.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" size={18} />
            <input
              type="text"
              placeholder="Search verified ingredients or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-foreground-tertiary" />
            <span className="shrink-0 text-xs text-foreground-secondary">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              !activeCategory
                ? "bg-primary text-on-primary shadow-glow-primary"
                : "border border-border bg-surface text-foreground-secondary hover:border-primary/50 hover:text-foreground"
            )}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.slug)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
                activeCategory === c.slug
                  ? "bg-primary text-on-primary shadow-glow-primary"
                  : "border border-border bg-surface text-foreground-secondary hover:border-primary/50 hover:text-foreground"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="text-xs font-medium text-foreground-tertiary">
          {loading ? "Loading…" : (
            <>Showing <strong className="text-foreground">{filteredProducts.length}</strong> verified batches</>
          )}
        </div>

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => {
              const Icon = activeCategory
                ? (CATEGORY_ICONS[categories.find((c) => c.slug === activeCategory)?.icon ?? ""] ?? Leaf)
                : Leaf;
              const currentQty = getQuantity(p);
              const photo = p.photos.find((ph) => ph.image)?.image;

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/40 hover:shadow-lifted"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/20 via-surface-muted to-accent/10">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={p.ingredient_name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icon size={56} className="text-primary/30" />
                        </div>
                      )}

                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-primary backdrop-blur-md">
                        <ShieldCheck size={12} /> NABL Verified
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-heading text-lg font-bold text-foreground drop-shadow">{p.ingredient_name}</h3>
                        <p className="text-[11px] text-foreground-secondary drop-shadow">Batch {p.public_id}</p>
                      </div>
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="tabular-nums text-2xl font-semibold text-primary">₹{p.price_per_unit}</span>
                          <span className="text-xs text-foreground-tertiary"> / {p.unit}</span>
                        </div>
                        <span className="text-[11px] text-foreground-tertiary">
                          Stock: {p.available_quantity} {p.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-tertiary">
                        <span className="flex items-center gap-1 text-foreground-secondary">
                          <Leaf size={12} className="text-primary" /> {p.supplier_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} className="text-accent-light" /> Harvested {p.harvest_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-5 pt-0">
                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted p-2">
                      <span className="pl-1 text-xs font-medium text-foreground-secondary">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(p.id, currentQty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-foreground hover:bg-surface-muted"
                          disabled={currentQty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="tabular-nums px-1 text-xs font-bold text-foreground">
                          {currentQty} {p.unit}
                        </span>
                        <button
                          onClick={() => setQuantity(p.id, currentQty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-foreground hover:bg-surface-muted"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/scan/${p.public_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] font-semibold text-foreground-secondary transition-colors hover:border-primary hover:text-foreground"
                      >
                        <FileText size={12} /> Lab Report
                      </a>
                      <Button onClick={() => handleAdd(p)} variant="accent" size="sm" className="text-xs">
                        {justAddedId === p.id ? "Added ✓" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-12 text-center">
            <QrCode size={48} className="mx-auto text-foreground-tertiary/40" />
            <h3 className="font-heading text-xl font-bold text-foreground">No verified batches found</h3>
            <p className="text-sm text-foreground-secondary">
              {searchQuery ? `Nothing matched "${searchQuery}" in this category.` : "No listed batches in this category yet."}
            </p>
            <Button onClick={() => { setSearchQuery(""); setActiveCategory(undefined); }} variant="outline" size="sm">
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
