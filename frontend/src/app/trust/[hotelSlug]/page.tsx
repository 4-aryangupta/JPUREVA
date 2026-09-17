import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { ApiError } from "@/lib/api/client";
import { fetchPublicTrustBadge } from "@/lib/api/public";

export default async function TrustBadgePage({ params }: { params: Promise<{ hotelSlug: string }> }) {
  const { hotelSlug } = await params;

  let data;
  try {
    data = await fetchPublicTrustBadge(hotelSlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 text-center">
      <Link href="/" className="font-heading text-xl text-primary">JPureva</Link>
      <Card className="mt-6 w-full">
        <CardBody>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-heading text-2xl text-foreground">{data.business_name}</h1>
          <p className="mt-1 text-sm text-foreground/60">{data.city}</p>
          <p className="mt-4 text-sm text-foreground/70">
            This restaurant sources ingredients through JPureva&apos;s verified supply chain —
            every batch is lab-tested and traceable back to its origin FPO.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
