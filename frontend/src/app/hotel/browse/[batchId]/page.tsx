"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Leaf, ShieldCheck, Thermometer } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mediaUrl } from "@/lib/api/client";
import { addToCart, getProduct } from "@/lib/api/hotels";
import type { Batch } from "@/lib/api/types";

export default function ProductDetailPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getProduct(batchId).then(setProduct);
  }, [batchId]);

  if (!product) return <p className="text-sm text-foreground-secondary">Loading…</p>;

  async function handleAdd() {
    setAdding(true);
    setMessage(null);
    try {
      await addToCart(product!.id, quantity);
      setMessage("Added to cart.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl text-foreground">{product.ingredient_name}</h1>
              <p className="text-sm text-foreground-secondary">Supplier: {product.supplier_name}</p>
            </div>
            {product.qr_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(product.qr_image) ?? undefined} alt="Trust QR" className="h-20 w-20" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-foreground-secondary">Price</div>
              <div className="font-semibold">₹{product.price_per_unit}/{product.unit}</div>
            </div>
            <div>
              <div className="text-foreground-secondary">Available</div>
              <div className="font-semibold">{product.available_quantity} {product.unit}</div>
            </div>
            <div>
              <div className="text-foreground-secondary">Harvest date</div>
              <div className="font-semibold">{product.harvest_date}</div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <ShieldCheck size={16} /> <span className="font-semibold">Lab verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-4 text-sm">
            <Leaf className="text-primary" size={18} />
            <div>
              <div className="font-medium">FPO origin verified</div>
              <div className="text-foreground-secondary">Traceable via geo-tagged harvest photos and NABL lab certificate.</div>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="w-24">
              <label className="mb-1 block text-xs text-foreground-secondary">Quantity</label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <Button onClick={handleAdd} loading={adding}>Add to cart</Button>
            <Button variant="outline" onClick={() => router.push("/hotel/cart")}>Go to cart</Button>
          </div>
          {message && <p className="text-sm text-success">{message}</p>}
        </CardBody>
      </Card>

      {product.photos.length > 0 && (
        <Card>
          <CardBody>
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Thermometer size={16} className="text-primary" /> Harvest Photos
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.photos.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(p.image) ?? undefined} alt="Harvest" className="h-24 w-full object-cover" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
