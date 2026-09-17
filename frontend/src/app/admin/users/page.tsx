"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { listUsers } from "@/lib/api/admin";
import type { PendingUser } from "@/lib/api/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    listUsers({ role: role || undefined }).then((res) => setUsers(res.results));
  }, [role]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-foreground">Users</h1>
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-48">
          <option value="">All roles</option>
          <option value="HOTEL">Hotel</option>
          <option value="LAB">Lab</option>
          <option value="SUPPLIER">Supplier</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      <Card>
        <CardBody className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">{u.email}</div>
                <div className="text-xs text-foreground-secondary">{u.role} · Joined {new Date(u.date_joined).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={u.approval_status} />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
