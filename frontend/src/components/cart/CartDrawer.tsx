"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchMe } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import type { CartItem } from "@/lib/store/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  discountAmount: number;
  discountRate: number;
  taxAmount: number;
  total: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  subtotal,
  discountAmount,
  discountRate,
  taxAmount,
  total,
}: CartDrawerProps) {
  const { user } = useAuth();
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (user?.role !== "HOTEL") {
      setProfileLoaded(false);
      return;
    }
    fetchMe()
      .then((me) => {
        const profile = (me.profile ?? {}) as { business_name?: string; city?: string };
        setHotelName(profile.business_name ?? "");
        setCity(profile.city ?? "");
        setPhone(me.phone ?? "");
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(false));
  }, [user]);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName || !phone) return;
    setOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={22} />
                <h2 className="font-heading text-lg font-bold text-foreground">Hotel Bulk Order Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-foreground-tertiary hover:bg-surface hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {orderSubmitted ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Bulk Quote Submitted!</h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  Thank you <strong className="text-foreground">{hotelName}</strong>. Our B2B supply officer will reach out to <strong className="text-foreground">{phone}</strong> within 30 minutes to confirm cold-chain dispatch.
                </p>
                <div className="rounded-xl border border-primary/25 bg-surface-muted p-4 text-xs text-primary">
                  Total Order Estimate: ₹{Math.round(total).toLocaleString()} (Includes NABL Lab Report & Cold Logistics)
                </div>
                <Button
                  onClick={() => {
                    clearCart();
                    setOrderSubmitted(false);
                    onClose();
                  }}
                  variant="accent"
                  className="mt-4 w-full"
                >
                  Back to Marketplace
                </Button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
                <ShoppingBag size={48} className="text-foreground-tertiary/40" />
                <h3 className="font-heading text-lg text-foreground">Your B2B Cart is Empty</h3>
                <p className="text-xs text-foreground-tertiary">
                  Select 100% pure raw vegetables, grains, spices, dairy, or oils to place a verified hotel procurement order.
                </p>
                <Button onClick={onClose} variant="outline" size="sm">
                  Browse Raw Produce Catalog
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto p-6 space-y-6">
                {/* List Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-muted p-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="font-heading text-sm font-bold text-foreground flex items-center justify-between">
                          <span>{item.product.name}</span>
                          <span className="tabular-nums text-xs font-semibold text-primary">
                            ₹{(item.product.pricePerUnit * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-tertiary">{item.product.hindiName}</p>

                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent-light">
                            MOQ: {item.product.moq} {item.product.unit}
                          </span>
                          <span className="text-foreground-tertiary text-[11px]">
                            ₹{item.product.pricePerUnit} / {item.product.unit}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-foreground-secondary">Qty:</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 5)}
                            className="h-7 w-7 rounded border border-border bg-surface text-center font-bold text-foreground hover:bg-surface-muted"
                          >
                            -
                          </button>
                          <span className="tabular-nums text-xs font-semibold text-foreground px-2">
                            {item.quantity} {item.product.unit}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 5)}
                            className="h-7 w-7 rounded border border-border bg-surface text-center font-bold text-foreground hover:bg-surface-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-foreground-tertiary hover:text-danger p-1"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Form for Hotel Order */}
                <form onSubmit={handleSubmitOrder} className="space-y-4 rounded-xl border border-border bg-surface-muted/60 p-4">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                    Hotel Dispatch Details
                  </h4>
                  {profileLoaded ? (
                    <div className="rounded-lg border border-primary/25 bg-surface px-3 py-2 text-xs">
                      <div className="font-semibold text-foreground">{hotelName}</div>
                      <div className="text-foreground-tertiary">{city} · {phone}</div>
                      <div className="mt-1 text-[10px] text-foreground-tertiary">From your JPureva hotel profile</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-foreground-secondary">Hotel / Kitchen Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Grand Palace Hotel"
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-foreground-secondary">City / Hub *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jaipur"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-foreground-secondary">Phone / WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Pricing Summary */}
                  <div className="border-t border-border pt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-foreground-secondary">
                      <span>Subtotal:</span>
                      <span className="tabular-nums">₹{Math.round(subtotal).toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-primary font-semibold">
                        <span>Bulk Tier Discount ({(discountRate * 100).toFixed(0)}%):</span>
                        <span className="tabular-nums">-₹{Math.round(discountAmount).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground-secondary">
                      <span>Agro GST (5%):</span>
                      <span className="tabular-nums">₹{Math.round(taxAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                      <span>Total Estimated Cost:</span>
                      <span className="tabular-nums text-primary">₹{Math.round(total).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="accent" size="lg" className="w-full">
                    Submit B2B Procurement Order <ArrowRight size={16} />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
