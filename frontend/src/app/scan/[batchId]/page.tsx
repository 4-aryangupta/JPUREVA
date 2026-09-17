import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Leaf, MapPin, ShieldCheck, Thermometer, XCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { ApiError, mediaUrl } from "@/lib/api/client";
import { fetchPublicBatchScan } from "@/lib/api/public";

export default async function ScanPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;

  let data;
  try {
    data = await fetchPublicBatchScan(batchId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const cert = data.certificate;
  const passed = cert?.overall_result === "PASS";

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <Link href="/" className="font-heading text-xl text-primary">JPureva</Link>

      <Card className="mt-6 overflow-hidden">
        <div className={`flex items-center gap-3 px-6 py-4 ${passed ? "bg-success/10" : "bg-warning/10"}`}>
          {passed ? <CheckCircle2 className="text-success" /> : <ShieldCheck className="text-warning" />}
          <div>
            <div className="font-heading text-lg text-foreground">{data.ingredient_name}</div>
            <div className="text-xs text-foreground/60">{data.category_name} · Batch {data.public_id}</div>
          </div>
        </div>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-foreground/50">Origin</div>
              <div className="mt-0.5 flex items-center gap-1 font-medium"><Leaf size={14} className="text-primary" />{data.fpo_name}</div>
              <div className="text-foreground/60">{data.fpo_region}</div>
            </div>
            <div>
              <div className="text-foreground/50">Harvest date</div>
              <div className="mt-0.5 font-medium">{data.harvest_date}</div>
              {data.is_growth_anomaly && (
                <div className="mt-1 flex items-center gap-1 text-xs font-medium text-danger">
                  <XCircle size={12} /> Growth anomaly flagged
                </div>
              )}
            </div>
            <div>
              <div className="text-foreground/50">Quantity</div>
              <div className="mt-0.5 font-medium">{data.quantity} {data.unit}</div>
            </div>
            <div>
              <div className="text-foreground/50">Status</div>
              <div className="mt-0.5 font-medium">{data.status.replace(/_/g, " ")}</div>
            </div>
          </div>

          {cert ? (
            <div className="rounded-xl border border-border bg-surface-muted p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <ShieldCheck size={16} className="text-primary" /> Lab Certificate
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                  {cert.overall_result}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-foreground/50">Lab</dt>
                <dd className="text-right font-medium">{cert.lab_name}</dd>
                <dt className="text-foreground/50">NABL number</dt>
                <dd className="text-right font-medium">{cert.nabl_accreditation_number}</dd>
                <dt className="text-foreground/50">Certificate no.</dt>
                <dd className="text-right font-medium">{cert.certificate_number}</dd>
                <dt className="text-foreground/50">Issued</dt>
                <dd className="text-right font-medium">{new Date(cert.issued_at).toLocaleDateString()}</dd>
                <dt className="text-foreground/50">Shelf life</dt>
                <dd className="text-right font-medium">{cert.shelf_life_days} days</dd>
              </dl>
              <div className="mt-3 space-y-1 text-xs text-foreground/60">
                {Object.entries(cert.test_results).map(([test, r]) => (
                  <div key={test} className="flex justify-between">
                    <span className="capitalize">{test.replace(/_/g, " ")}</span>
                    <span className="font-medium">{r.result}{r.value ? ` (${r.value})` : ""}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 truncate text-[10px] text-foreground/40" title={cert.integrity_hash}>
                Integrity hash: {cert.integrity_hash}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-foreground/50">
              No lab certificate on file for this batch yet.
            </div>
          )}

          {data.coldchain_logs.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Thermometer size={16} className="text-primary" /> Cold-Chain Log
              </div>
              <div className="space-y-2">
                {data.coldchain_logs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>{log.stage}{log.location_name ? ` · ${log.location_name}` : ""}</span>
                    <span className={log.is_within_threshold ? "text-success" : "text-danger"}>{log.temperature_c}°C</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.photos.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <MapPin size={16} className="text-primary" /> Geo-Tagged Photos
              </div>
              <div className="grid grid-cols-2 gap-3">
                {data.photos.map((p, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-border">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(p.image) ?? undefined} alt="Batch photo" className="h-32 w-full object-cover" />
                    )}
                    <div className="p-2 text-[11px] text-foreground/50">
                      {p.exif_locked ? "EXIF-verified location" : "Location unverified"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-xs text-foreground/40">Verified by JPureva — Farm to Kitchen, Verified.</p>
    </div>
  );
}
