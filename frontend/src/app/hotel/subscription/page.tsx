"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { getHotelSubscription, listSubscriptionPlans, subscribeToPlan } from "@/lib/api/hotels";
import type { HotelSubscription, SubscriptionPlan } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [current, setCurrent] = useState<HotelSubscription | null>(null);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  function load() {
    Promise.all([listSubscriptionPlans(), getHotelSubscription()]).then(([plansRes, sub]) => {
      setPlans(plansRes.results);
      setCurrent(sub);
    });
  }

  useEffect(load, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Subscription</h1>
      <p className="text-sm text-foreground-secondary">Choose the plan that fits your kitchen&apos;s ordering volume.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = current?.plan === p.id;
          return (
            <Card key={p.id} className={cn(isCurrent && "ring-2 ring-primary")}>
              <CardBody>
                <div className="font-heading text-lg text-foreground">{p.name}</div>
                <div className="mt-2 text-2xl font-semibold">₹{p.price_monthly}<span className="text-sm font-normal text-foreground-secondary">/mo</span></div>
                <div className="text-xs text-foreground-secondary">or ₹{p.price_annual}/year</div>
                <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
                  {Object.entries(p.features).map(([k, v]) => (
                    <li key={k} className="flex items-center gap-2">
                      <Check size={14} className="text-success" />
                      {k.replace(/_/g, " ")}: {String(v)}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  variant={isCurrent ? "outline" : "primary"}
                  loading={subscribing === p.id}
                  disabled={isCurrent}
                  onClick={() => {
                    setSubscribing(p.id);
                    subscribeToPlan(p.id).then(load).finally(() => setSubscribing(null));
                  }}
                >
                  {isCurrent ? "Current plan" : "Choose plan"}
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
