"use client";

import { useState } from "react";
import {
  LogIn,
  LogOut,
  Coffee,
  UtensilsCrossed,
  Palmtree,
  Laptop,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { format } from "date-fns";

interface ActivityEvent {
  id: string;
  employeeId: string;
  type:
    | "clock-in"
    | "clock-out"
    | "break-start"
    | "break-end"
    | "leave-applied"
    | "wfh-start"
    | "late-arrival"
    | "overtime-alert";
  time: string;
  details?: string;
}

const todayActivity: ActivityEvent[] = [
  { id: "e1", employeeId: "9", type: "clock-in", time: "08:45", details: "Early arrival" },
  { id: "e2", employeeId: "6", type: "leave-applied", time: "08:48", details: "Casual leave — Family function" },
  { id: "e3", employeeId: "4", type: "clock-in", time: "08:55" },
  { id: "e4", employeeId: "1", type: "clock-in", time: "09:00" },
  { id: "e5", employeeId: "9", type: "break-start", time: "10:00", details: "Tea break" },
  { id: "e6", employeeId: "2", type: "clock-in", time: "09:02" },
  { id: "e7", employeeId: "7", type: "clock-in", time: "09:05" },
  { id: "e8", employeeId: "5", type: "wfh-start", time: "09:10", details: "Internet installation at home" },
  { id: "e9", employeeId: "10", type: "clock-in", time: "09:10" },
  { id: "e10", employeeId: "3", type: "late-arrival", time: "09:18", details: "18 min late — grace period exceeded" },
  { id: "e11", employeeId: "12", type: "wfh-start", time: "09:20", details: "Plumber visit scheduled" },
  { id: "e12", employeeId: "8", type: "clock-in", time: "09:32", details: "Half day" },
  { id: "e13", employeeId: "9", type: "break-end", time: "10:15", details: "Tea break — 15m" },
  { id: "e14", employeeId: "1", type: "break-start", time: "10:15", details: "Tea break" },
  { id: "e15", employeeId: "1", type: "break-end", time: "10:30", details: "Tea break — 15m" },
  { id: "e16", employeeId: "3", type: "break-start", time: "10:30", details: "Tea break" },
  { id: "e17", employeeId: "2", type: "break-start", time: "10:45", details: "Tea break" },
  { id: "e18", employeeId: "2", type: "break-end", time: "11:00", details: "Tea break — 15m" },
  { id: "e19", employeeId: "4", type: "break-start", time: "11:00", details: "Tea break" },
  { id: "e20", employeeId: "4", type: "break-end", time: "11:10", details: "Tea break — 10m" },
  { id: "e21", employeeId: "11", type: "clock-in", time: "06:00", details: "Morning shift" },
  { id: "e22", employeeId: "4", type: "break-start", time: "12:30", details: "Lunch break" },
  { id: "e23", employeeId: "7", type: "break-start", time: "12:45", details: "Lunch break" },
  { id: "e24", employeeId: "1", type: "break-start", time: "13:00", details: "Lunch break" },
  { id: "e25", employeeId: "9", type: "break-start", time: "13:00", details: "Lunch break" },
  { id: "e26", employeeId: "4", type: "break-end", time: "13:15", details: "Lunch — 45m" },
  { id: "e27", employeeId: "2", type: "break-start", time: "13:15", details: "Lunch break" },
  { id: "e28", employeeId: "9", type: "break-end", time: "13:30", details: "Lunch — 30m" },
  { id: "e29", employeeId: "1", type: "break-end", time: "13:45", details: "Lunch — 45m" },
  { id: "e30", employeeId: "2", type: "break-end", time: "14:00", details: "Lunch — 45m" },
  { id: "e31", employeeId: "9", type: "overtime-alert", time: "18:00", details: "1h overtime logged" },
];

const sortedActivity = [...todayActivity].sort((a, b) => {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return toMin(b.time) - toMin(a.time);
});

const eventConfig: Record<
  ActivityEvent["type"],
  { icon: typeof LogIn; color: string; bg: string; label: string }
> = {
  "clock-in": { icon: LogIn, color: "text-status-present", bg: "bg-status-present-bg", label: "Clocked in" },
  "clock-out": { icon: LogOut, color: "text-muted-foreground", bg: "bg-muted", label: "Clocked out" },
  "break-start": { icon: Coffee, color: "text-amber-600", bg: "bg-amber-50", label: "Break started" },
  "break-end": { icon: Coffee, color: "text-amber-600", bg: "bg-amber-50", label: "Break ended" },
  "leave-applied": { icon: Palmtree, color: "text-status-leave", bg: "bg-status-leave-bg", label: "Leave applied" },
  "wfh-start": { icon: Laptop, color: "text-status-wfh", bg: "bg-status-wfh-bg", label: "WFH started" },
  "late-arrival": { icon: AlertTriangle, color: "text-status-late", bg: "bg-status-late-bg", label: "Late arrival" },
  "overtime-alert": { icon: Clock, color: "text-status-halfday", bg: "bg-status-halfday-bg", label: "Overtime" },
};

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  const filtered = sortedActivity.filter((ev) => {
    if (filter === "all") return true;
    return ev.type === filter;
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Activity timeline</h1>
          <p className="text-sm text-muted-foreground">
            Real-time audit log of all attendance events
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-2">
          <button
            onClick={() =>
              setCurrentDate((d) => new Date(d.getTime() - 86400000))
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[130px] text-center">
            {format(currentDate, "EEE, MMM d")}
          </span>
          <button
            onClick={() =>
              setCurrentDate((d) => new Date(d.getTime() + 86400000))
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All events</SelectItem>
            <SelectItem value="clock-in">Clock in</SelectItem>
            <SelectItem value="clock-out">Clock out</SelectItem>
            <SelectItem value="break-start">Break start</SelectItem>
            <SelectItem value="break-end">Break end</SelectItem>
            <SelectItem value="late-arrival">Late arrivals</SelectItem>
            <SelectItem value="leave-applied">Leave</SelectItem>
            <SelectItem value="wfh-start">WFH</SelectItem>
            <SelectItem value="overtime-alert">Overtime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {filtered.map((ev) => {
            const emp = employees.find((e) => e.id === ev.employeeId);
            if (!emp) return null;
            const config = eventConfig[ev.type];
            const Icon = config.icon;
            return (
              <div key={ev.id} className="relative flex items-start gap-4 py-2.5 pl-1">
                <div
                  className={`w-[46px] shrink-0 flex items-center justify-center`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg} relative z-10`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-between min-w-0 pr-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                        {getInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {config.label.toLowerCase()}
                        </span>
                      </p>
                      {ev.details && (
                        <p className="text-xs text-muted-foreground truncate">
                          {ev.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground shrink-0 ml-3">
                    {ev.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
