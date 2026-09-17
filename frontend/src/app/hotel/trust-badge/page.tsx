"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { mediaUrl } from "@/lib/api/client";
import { getTrustBadge, regenerateTrustBadge } from "@/lib/api/hotels";
import type { TrustBadge } from "@/lib/api/types";

export default function TrustBadgePage() {
  const [badge, setBadge] = useState<TrustBadge | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    getTrustBadge().then(setBadge).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-foreground-secondary">Loading trust badge…</p>;

  const publicUrl = badge ? `${window.location.origin}/trust/${badge.public_slug}` : "";

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Trust Badge</h1>
      <p className="text-sm text-foreground-secondary">
        Display this QR code at your restaurant so diners can verify your JPureva-sourced supply chain.
      </p>

      <Card>
        <CardBody className="flex flex-col items-center gap-4 text-center">
          {badge?.qr_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(badge.qr_image) ?? undefined} alt="Trust badge QR" className="h-48 w-48" />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-foreground-tertiary">
              No QR yet
            </div>
          )}
          <div className="text-sm text-foreground-secondary">{publicUrl}</div>
          <Button
            variant="outline"
            loading={regenerating}
            onClick={() => {
              setRegenerating(true);
              regenerateTrustBadge().then(setBadge).finally(() => setRegenerating(false));
            }}
          >
            Regenerate QR
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
