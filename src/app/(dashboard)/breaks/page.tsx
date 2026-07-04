"use client";

import { useState } from "react";
import { Coffee, UtensilsCrossed, Clock, Play, Pause } from "lucide-react";
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
import { employees, getInitials } from "@/lib/mock-data";

type BreakType = "tea" | "lunch" | "other";
type BreakStatus = "idle" | BreakType;

interface LiveBreak {
  employeeId: string;
  type: BreakType;
  startedAt: string;
  duration: number;
}

const liveBreaks: LiveBreak[] = [
  { employeeId: "3", type: "tea", startedAt: "10:30", duration: 12 },
  { employeeId: "7", type: "lunch", startedAt: "12:45", duration: 25 },
];

const breakHistory = [
  { employeeId: "1", type: "tea" as const, start: "10:15", end: "10:30", duration: 15 },
  { employeeId: "1", type: "lunch" as const, start: "13:00", end: "13:45", duration: 45 },
  { employeeId: "2", type: "tea" as const, start: "10:45", end: "11:00", duration: 15 },
  { employeeId: "2", type: "lunch" as const, start: "13:15", end: "14:00", duration: 45 },
  { employeeId: "3", type: "tea" as const, start: "10:30", end: null, duration: 12 },
  { employeeId: "4", type: "tea" as const, start: "11:00", end: "11:10", duration: 10 },
  { employeeId: "4", type: "lunch" as const, start: "12:30", end: "13:15", duration: 45 },
  { employeeId: "7", type: "lunch" as const, start: "12:45", end: null, duration: 25 },
  { employeeId: "9", type: "tea" as const, start: "10:00", end: "10:15", duration: 15 },
  { employeeId: "9", type: "lunch" as const, start: "13:00", end: "13:30", duration: 30 },
  { employeeId: "10", type: "tea" as const, start: "10:30", end: "10:45", duration: 15 },
  { employeeId: "11", type: "lunch" as const, start: "11:30", end: "12:15", duration: 45 },
];

const breakConfig = {
  tea: { icon: Coffee, label: "Tea break", color: "text-amber-600", bg: "bg-amber-50", maxMinutes: 15 },
  lunch: { icon: UtensilsCrossed, label: "Lunch break", color: "text-orange-600", bg: "bg-orange-50", maxMinutes: 60 },
  other: { icon: Clock, label: "Other", color: "text-blue-600", bg: "bg-blue-50", maxMinutes: 30 },
};

export default function BreaksPage() {
  const [filter, setFilter] = useState("all");

  const filteredHistory = breakHistory.filter((b) => {
    if (filter === "all") return true;
    return b.type === filter;
  });

  const totalTeaToday = breakHistory
    .filter((b) => b.type === "tea" && b.end)
    .reduce((sum, b) => sum + b.duration, 0);
  const totalLunchToday = breakHistory
    .filter((b) => b.type === "lunch" && b.end)
    .reduce((sum, b) => sum + b.duration, 0);
  const avgBreakPerPerson = Math.round(
    (totalTeaToday + totalLunchToday) /
      new Set(breakHistory.map((b) => b.employeeId)).size
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Break management</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage employee breaks
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            On break now
          </p>
          <p className="text-2xl font-medium font-mono text-amber-600 mt-1">
            {liveBreaks.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Active breaks</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total tea breaks
          </p>
          <p className="text-2xl font-medium font-mono mt-1">
            {totalTeaToday}m
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Today (all staff)</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total lunch breaks
          </p>
          <p className="text-2xl font-medium font-mono mt-1">
            {totalLunchToday}m
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Today (all staff)</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Avg per person
          </p>
          <p className="text-2xl font-medium font-mono text-primary mt-1">
            {avgBreakPerPerson}m
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Break time today</p>
        </Card>
      </div>

      {/* Live breaks */}
      {liveBreaks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Currently on break
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveBreaks.map((lb) => {
              const emp = employees.find((e) => e.id === lb.employeeId);
              if (!emp) return null;
              const config = breakConfig[lb.type];
              const Icon = config.icon;
              const isOvertime = lb.duration > config.maxMinutes;
              return (
                <Card
                  key={lb.employeeId}
                  className={`p-4 border-l-4 ${isOvertime ? "border-l-red-400" : "border-l-amber-400"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {emp.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                        <span className="text-xs font-medium">{config.label}</span>
                      </div>
                      <p className={`text-sm font-mono mt-0.5 ${isOvertime ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        {lb.duration}m
                        {isOvertime && (
                          <span className="text-[10px] ml-1">
                            ({lb.duration - config.maxMinutes}m over)
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Since {lb.startedAt}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Break history */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Today&apos;s break log</h3>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="tea">Tea breaks</SelectItem>
            <SelectItem value="lunch">Lunch breaks</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="divide-y divide-border">
          {filteredHistory.map((brk, i) => {
            const emp = employees.find((e) => e.id === brk.employeeId);
            if (!emp) return null;
            const config = breakConfig[brk.type];
            const Icon = config.icon;
            const isActive = !brk.end;
            const isOvertime = brk.duration > config.maxMinutes;
            return (
              <div
                key={`${brk.employeeId}-${brk.type}-${i}`}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                      {getInitials(emp.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {emp.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span className="text-xs">{config.label}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-28 text-center">
                    {brk.start} — {brk.end || "ongoing"}
                  </span>
                  <span
                    className={`text-xs font-mono w-12 text-right ${
                      isOvertime
                        ? "text-red-500 font-medium"
                        : isActive
                          ? "text-amber-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {brk.duration}m
                  </span>
                  {isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
