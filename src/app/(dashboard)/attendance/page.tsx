"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  todayAttendance,
  getEmployee,
  getInitials,
} from "@/lib/mock-data";
import { useAuth, isManager, isAdmin } from "@/lib/auth-context";
import { format } from "date-fns";

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuth();

  const role = user?.role || "employee";
  const myId = user?.employee.id;
  const isRegularEmployee = role === "employee";

  const records = todayAttendance.filter((rec) => {
    if (isRegularEmployee && rec.employeeId !== myId) return false;

    const emp = getEmployee(rec.employeeId);
    if (!emp) return false;
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isRegularEmployee) {
    const myRecord = records[0];
    const emp = myRecord ? getEmployee(myRecord.employeeId) : null;

    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-tight">My attendance</h1>
          <p className="text-sm text-muted-foreground">
            Your attendance record for today
          </p>
        </div>

        {myRecord && emp ? (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(emp.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold tracking-tight">{emp.name}</p>
                <p className="text-sm text-muted-foreground">{emp.department} &middot; {emp.designation}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={myRecord.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Check in</p>
                <p className="text-base font-mono font-medium mt-1">{myRecord.checkIn || "—"}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Check out</p>
                <p className="text-base font-mono font-medium mt-1">{myRecord.checkOut || "—"}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Working hrs</p>
                <p className="text-base font-mono font-medium mt-1">{myRecord.workingHours ? `${myRecord.workingHours}h` : "—"}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Overtime</p>
                <p className="text-base font-mono font-medium mt-1">{myRecord.overtime ? `${myRecord.overtime}h` : "—"}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No attendance record found for today.</p>
          </Card>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <Lock className="w-4 h-4 shrink-0" />
          <p>Full attendance records are only accessible to managers and administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin(role) ? "All employee attendance records" : "Team attendance records"}
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-2">
          <button
            onClick={() =>
              setCurrentDate(
                (d) => new Date(d.getTime() - 86400000)
              )
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[140px] text-center">
            {format(currentDate, "EEE, MMM d, yyyy")}
          </span>
          <button
            onClick={() =>
              setCurrentDate(
                (d) => new Date(d.getTime() + 86400000)
              )
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="half-day">Half day</SelectItem>
            <SelectItem value="wfh">WFH</SelectItem>
            <SelectItem value="casual-leave">On leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Check in</TableHead>
              <TableHead>Check out</TableHead>
              <TableHead>Working hrs</TableHead>
              <TableHead>Break hrs</TableHead>
              <TableHead>Overtime</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => {
              const emp = getEmployee(rec.employeeId);
              if (!emp) return null;
              return (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/employees/${emp.id}`} className="text-sm font-medium hover:text-primary transition-colors">{emp.name}</Link>
                        <p className="text-xs text-muted-foreground">
                          {emp.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.checkIn || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.checkOut || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.workingHours ? `${rec.workingHours}h` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.breakHours ? `${rec.breakHours}h` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.overtime ? `${rec.overtime}h` : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rec.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
