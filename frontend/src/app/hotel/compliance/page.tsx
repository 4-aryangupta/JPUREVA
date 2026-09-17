"use client";

import { useEffect, useState } from "react";
import { FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { listComplianceDocuments, uploadComplianceDocument } from "@/lib/api/hotels";
import type { ComplianceDocument } from "@/lib/api/types";

export default function CompliancePage() {
  const [docs, setDocs] = useState<ComplianceDocument[]>([]);
  const [docType, setDocType] = useState("FSSAI_LICENSE");
  const [file, setFile] = useState<File | null>(null);
  const [issuedDate, setIssuedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploading, setUploading] = useState(false);

  function load() {
    listComplianceDocuments().then((res) => setDocs(res.results));
  }

  useEffect(load, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await uploadComplianceDocument(docType, file, issuedDate || undefined, expiryDate || undefined);
      setFile(null);
      setIssuedDate("");
      setExpiryDate("");
      load();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Compliance documents</h1>
      <p className="text-sm text-foreground-secondary">Keep your FSSAI license and audit reports up to date to avoid expiry alerts.</p>

      <Card>
        <CardBody className="space-y-3">
          {docs.length === 0 && <p className="text-sm text-foreground-secondary">No documents uploaded yet.</p>}
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} className="text-primary" />
                <div>
                  <div className="text-sm font-medium">{d.doc_type.replace(/_/g, " ")}</div>
                  <div className="text-xs text-foreground-secondary">Expires {d.expiry_date ?? "—"}</div>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="mb-3 font-semibold">Upload new document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <Field label="Document type">
              <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="FSSAI_LICENSE">FSSAI License</option>
                <option value="AUDIT_REPORT">Audit Report</option>
                <option value="OTHER">Other</option>
              </Select>
            </Field>
            <Field label="File">
              <input type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Issued date"><Input type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} /></Field>
              <Field label="Expiry date"><Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} /></Field>
            </div>
            <Button type="submit" loading={uploading}>Upload</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
