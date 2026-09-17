"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { mediaUrl } from "@/lib/api/client";
import {
  getBatch,
  listBatchForSale,
  requestVerification,
  uploadBatchPhoto,
} from "@/lib/api/suppliers";
import type { Batch } from "@/lib/api/types";

export default function SupplierBatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [price, setPrice] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [listing, setListing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    getBatch(id).then(setBatch);
  }

  useEffect(load, [id]);

  if (!batch) return <p className="text-sm text-foreground-secondary">Loading batch…</p>;

  async function handlePhotoUpload() {
    if (!photoFile) return;
    setUploading(true);
    try {
      await uploadBatchPhoto(batch!.id, photoFile);
      setPhotoFile(null);
      load();
    } finally {
      setUploading(false);
    }
  }

  async function handleRequestVerification() {
    setRequesting(true);
    setMessage(null);
    try {
      await requestVerification(batch!.id);
      setMessage("Verification requested — a lab will pick this up shortly.");
      load();
    } finally {
      setRequesting(false);
    }
  }

  async function handleListForSale(e: React.FormEvent) {
    e.preventDefault();
    setListing(true);
    setMessage(null);
    try {
      await listBatchForSale(batch!.id, price, availableQty);
      setMessage("Batch listed for sale.");
      load();
    } finally {
      setListing(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">{batch.ingredient_name}</h1>
          <p className="text-sm text-foreground-secondary">Batch {batch.public_id}</p>
        </div>
        <StatusBadge status={batch.status} />
      </div>

      {batch.is_growth_anomaly && (
        <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertTriangle size={16} /> Growth anomaly flagged — harvested faster than biologically expected.
        </div>
      )}

      <Card>
        <CardBody className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div><div className="text-foreground-secondary">Quantity</div><div className="font-medium">{batch.quantity} {batch.unit}</div></div>
          <div><div className="text-foreground-secondary">Sowing date</div><div className="font-medium">{batch.sowing_date ?? "—"}</div></div>
          <div><div className="text-foreground-secondary">Harvest date</div><div className="font-medium">{batch.harvest_date}</div></div>
          {batch.qr_image && (
            <div className="col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(batch.qr_image) ?? undefined} alt="Batch QR" className="h-24 w-24" />
            </div>
          )}
        </CardBody>
      </Card>

      {message && <p className="text-sm text-success">{message}</p>}

      {(batch.status === "DRAFT" || batch.status === "REJECTED") && (
        <Card>
          <CardHeader><CardTitle>Request lab verification</CardTitle></CardHeader>
          <CardBody>
            <p className="mb-3 text-sm text-foreground-secondary">Submit this batch for NABL lab testing before listing it for sale.</p>
            <Button onClick={handleRequestVerification} loading={requesting}>Request verification</Button>
          </CardBody>
        </Card>
      )}

      {batch.status === "VERIFIED" && (
        <Card>
          <CardHeader><CardTitle>List for sale</CardTitle></CardHeader>
          <CardBody>
            <form onSubmit={handleListForSale} className="grid grid-cols-2 gap-4">
              <Field label="Price per unit (₹)"><Input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
              <Field label="Available quantity"><Input type="number" required value={availableQty} onChange={(e) => setAvailableQty(e.target.value)} /></Field>
              <Button type="submit" loading={listing} className="col-span-2">List batch</Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Geo-tagged harvest photos</CardTitle></CardHeader>
        <CardBody>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {batch.photos.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(p.image) ?? undefined} alt="Harvest" className="h-24 w-full object-cover" />
                <div className="p-1.5 text-[10px] text-foreground-secondary">
                  {p.exif_locked ? "EXIF-verified" : "Unverified location"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} className="text-sm" />
            <Button onClick={handlePhotoUpload} loading={uploading} disabled={!photoFile} size="sm">Upload</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
