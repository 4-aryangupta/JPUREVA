"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { createColdChainLog, listBatches, listSupplierColdChainLogs } from "@/lib/api/suppliers";
import type { Batch, ColdChainLog } from "@/lib/api/types";

export default function SupplierColdChainPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [logs, setLogs] = useState<ColdChainLog[]>([]);
  const [batchId, setBatchId] = useState("");
  const [stage, setStage] = useState<"WAREHOUSE" | "TRANSIT" | "DELIVERY">("WAREHOUSE");
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState("4");
  const [recordedAt, setRecordedAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    listSupplierColdChainLogs().then((res) => setLogs(res.results));
  }

  useEffect(() => {
    listBatches().then((res) => {
      setBatches(res.results);
      if (res.results.length > 0) setBatchId(res.results[0].id);
    });
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createColdChainLog({
        batch: batchId,
        stage,
        location_name: location,
        temperature_c: Number(temperature),
        recorded_at: recordedAt || new Date().toISOString(),
      });
      setLocation("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Cold-chain logs</h1>

      <Card>
        <CardBody>
          <h2 className="mb-3 font-semibold">Log a reading</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Field label="Batch">
              <Select value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.ingredient_name} · {b.public_id}</option>)}
              </Select>
            </Field>
            <Field label="Stage">
              <Select value={stage} onChange={(e) => setStage(e.target.value as typeof stage)}>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="TRANSIT">Transit</option>
                <option value="DELIVERY">Delivery</option>
              </Select>
            </Field>
            <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
            <Field label="Temperature (°C)"><Input type="number" step="0.1" value={temperature} onChange={(e) => setTemperature(e.target.value)} /></Field>
            <div className="col-span-2">
              <Field label="Recorded at"><Input type="datetime-local" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} /></Field>
            </div>
            <Button type="submit" loading={submitting} className="col-span-2" disabled={!batchId}>Add log</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-2">
          {logs.length === 0 && <p className="text-sm text-foreground-secondary">No cold-chain logs yet.</p>}
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0">
              <span>{log.stage} · {log.location_name || "—"}</span>
              <span className={log.is_within_threshold ? "text-success" : "text-danger"}>{log.temperature_c}°C</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
