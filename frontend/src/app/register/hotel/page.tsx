"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { dashboardPathForRole, useAuth } from "@/lib/auth/AuthContext";

export default function RegisterHotelPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "", password: "", business_name: "", fssai_license_number: "",
    gstin: "", address: "", city: "", cuisine_type: "", phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.registerHotel(form);
      const user = await login(form.email, form.password);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? "Registration failed. Check your details and try again." : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg">
        <CardBody>
          <Link href="/" className="font-heading text-xl text-primary">JPureva</Link>
          <h1 className="mt-4 font-heading text-2xl text-foreground">Register your Hotel / Restaurant</h1>
          <p className="mt-1 text-sm text-foreground/60">Get instant access to verified, traceable ingredients.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Business name"><Input required value={form.business_name} onChange={(e) => set("business_name", e.target.value)} /></Field>
            <Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <Field label="Email"><Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Password"><Input type="password" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="FSSAI license number"><Input value={form.fssai_license_number} onChange={(e) => set("fssai_license_number", e.target.value)} /></Field>
            <Field label="GSTIN"><Input value={form.gstin} onChange={(e) => set("gstin", e.target.value)} /></Field>
            <Field label="Cuisine type"><Input value={form.cuisine_type} onChange={(e) => set("cuisine_type", e.target.value)} /></Field>
            <div className="sm:col-span-2">
              <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
            </div>
            {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
            <Button type="submit" className="sm:col-span-2" loading={loading}>Create account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
