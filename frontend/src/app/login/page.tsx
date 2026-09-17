"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/client";
import { dashboardPathForRole, useAuth } from "@/lib/auth/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      const next = searchParams.get("next");
      router.push(next || dashboardPathForRole(user.role));
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = (err.data as { detail?: string } | null)?.detail;
        setError(detail && detail !== "No active account found with the given credentials" ? detail : "Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardBody>
          <Link href="/" className="font-heading text-xl text-primary">
            JPureva
          </Link>
          <h1 className="mt-4 font-heading text-2xl text-foreground">Log in</h1>
          <p className="mt-1 text-sm text-foreground/60">Access your JPureva dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            New to JPureva?{" "}
            <Link href="/register/hotel" className="font-medium text-primary hover:underline">
              Register your Hotel
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
