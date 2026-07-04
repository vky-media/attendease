"use client";

import { useState } from "react";
import { Search, Plus, Shield, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { employees, getInitials } from "@/lib/mock-data";

type UserRole = "super-admin" | "hr" | "manager" | "employee";

interface UserAccount {
  employeeId: string;
  role: UserRole;
  lastLogin: string;
  twoFactor: boolean;
  active: boolean;
}

const userAccounts: UserAccount[] = [
  { employeeId: "1", role: "manager", lastLogin: "2026-07-03 09:02", twoFactor: true, active: true },
  { employeeId: "2", role: "employee", lastLogin: "2026-07-03 09:05", twoFactor: false, active: true },
  { employeeId: "3", role: "employee", lastLogin: "2026-07-03 09:20", twoFactor: false, active: true },
  { employeeId: "4", role: "manager", lastLogin: "2026-07-03 08:57", twoFactor: true, active: true },
  { employeeId: "5", role: "employee", lastLogin: "2026-07-03 09:10", twoFactor: false, active: true },
  { employeeId: "6", role: "hr", lastLogin: "2026-07-03 08:50", twoFactor: true, active: true },
  { employeeId: "7", role: "employee", lastLogin: "2026-07-03 09:07", twoFactor: false, active: true },
  { employeeId: "8", role: "employee", lastLogin: "2026-07-02 09:00", twoFactor: false, active: true },
  { employeeId: "9", role: "super-admin", lastLogin: "2026-07-03 08:46", twoFactor: true, active: true },
  { employeeId: "10", role: "manager", lastLogin: "2026-07-03 09:12", twoFactor: true, active: true },
  { employeeId: "11", role: "manager", lastLogin: "2026-07-03 06:02", twoFactor: false, active: true },
  { employeeId: "12", role: "employee", lastLogin: "2026-07-02 09:15", twoFactor: false, active: true },
];

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  "super-admin": { label: "Super Admin", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
  hr: { label: "HR", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
  manager: { label: "Manager", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
  employee: { label: "Employee", icon: UserCog, color: "text-muted-foreground", bg: "bg-muted" },
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = userAccounts.filter((user) => {
    const emp = employees.find((e) => e.id === user.employeeId);
    if (!emp) return false;
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    "super-admin": userAccounts.filter((u) => u.role === "super-admin").length,
    hr: userAccounts.filter((u) => u.role === "hr").length,
    manager: userAccounts.filter((u) => u.role === "manager").length,
    employee: userAccounts.filter((u) => u.role === "employee").length,
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">User management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and access
          </p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary hover:bg-teal-600 text-primary-foreground transition-colors cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Invite user
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite new user</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Email address</Label>
                <Input type="email" placeholder="user@company.com" className="mt-1.5" />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-primary hover:bg-teal-600 text-primary-foreground">
                Send invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(
          ([role, config]) => {
            const Icon = config.icon;
            return (
              <Card key={role} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {config.label}
                  </p>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <p className="text-2xl font-medium font-mono mt-1">
                  {roleCounts[role]}
                </p>
              </Card>
            );
          }
        )}
      </div>

      {/* Search and filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="super-admin">Super Admin</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User list */}
      <Card>
        <div className="divide-y divide-border">
          {filtered.map((user) => {
            const emp = employees.find((e) => e.id === user.employeeId);
            if (!emp) return null;
            const config = roleConfig[user.role];
            const Icon = config.icon;
            return (
              <div
                key={user.employeeId}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(emp.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium ${config.bg} ${config.color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <div className="text-right hidden md:block">
                    <p className="text-[11px] text-muted-foreground">
                      Last login
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {user.lastLogin}
                    </p>
                  </div>
                  {user.twoFactor && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-present-bg text-status-present-text font-medium hidden md:inline">
                      2FA
                    </span>
                  )}
                  <Select defaultValue={user.role}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
