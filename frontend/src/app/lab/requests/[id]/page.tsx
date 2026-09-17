"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { claimVerificationRequest, issueCertificate, listVerificationRequests } from "@/lib/api/labs";
import type { VerificationRequest } from "@/lib/api/types";

const TEST_KEYS = ["adulteration", "heavy_metals", "microbiological"];

export default function LabRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [overallResult, setOverallResult] = useState<"PASS" | "FAIL" | "CONDITIONAL">("PASS");
  const [shelfLife, setShelfLife] = useState("7");
  const [testingFee, setTestingFee] = useState("500");
  const [results, setResults] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    listVerificationRequests().then((res) => {
      const found = res.results.find((r) => r.id === Number(id));
      setRequest(found ?? null);
    });
  }

  useEffect(load, [id]);

  if (!request) return <p className="text-sm text-foreground-secondary">Loading request…</p>;

  const alreadyCompleted = request.status === "COMPLETED";

  async function handleClaim() {
    await claimVerificationRequest(request!.id);
    load();
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const test_results = Object.fromEntries(
        TEST_KEYS.map((k) => [k, { result: results[k] ?? "pass" }])
      );
      await issueCertificate(request!.id, {
        overall_result: overallResult,
        shelf_life_days: Number(shelfLife),
        testing_fee: testingFee,
        test_results,
      });
      router.push("/lab/certificates");
    } catch {
      setError("Could not issue certificate. A certificate may already exist for this request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">{request.ingredient_name}</h1>
          <p className="text-sm text-foreground-secondary">Batch {request.batch_public_id} · Supplier {request.supplier_name}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {request.status === "REQUESTED" && (
        <Card><CardBody className="flex items-center justify-between">
          <p className="text-sm text-foreground-secondary">Claim this request to begin testing.</p>
          <Button onClick={handleClaim}>Claim request</Button>
        </CardBody></Card>
      )}

      {alreadyCompleted ? (
        <Card><CardBody><p className="text-sm text-foreground-secondary">This request has already been certified. See the Certificates tab for details.</p></CardBody></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Issue certificate</CardTitle></CardHeader>
          <CardBody>
            <form onSubmit={handleIssue} className="space-y-4">
              {TEST_KEYS.map((key) => (
                <Field key={key} label={key.replace(/_/g, " ")}>
                  <Select value={results[key] ?? "pass"} onChange={(e) => setResults((r) => ({ ...r, [key]: e.target.value }))}>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </Select>
                </Field>
              ))}
              <Field label="Overall result">
                <Select value={overallResult} onChange={(e) => setOverallResult(e.target.value as typeof overallResult)}>
                  <option value="PASS">Pass</option>
                  <option value="CONDITIONAL">Conditional</option>
                  <option value="FAIL">Fail</option>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Shelf life (days)"><Input type="number" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} /></Field>
                <Field label="Testing fee (₹)"><Input type="number" value={testingFee} onChange={(e) => setTestingFee(e.target.value)} /></Field>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" loading={submitting} className="w-full">Issue certificate & generate QR</Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
