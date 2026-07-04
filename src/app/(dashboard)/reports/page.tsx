"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Mail, Calendar, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { employees, getInitials, todayAttendance, getEmployee } from "@/lib/mock-data";
import { toast } from "sonner";
import { format } from "date-fns";

const monthlyData = employees.slice(0, 8).map((emp) => ({
  employee: emp,
  present: Math.floor(Math.random() * 4) + 18,
  absent: Math.floor(Math.random() * 3),
  late: Math.floor(Math.random() * 4),
  leave: Math.floor(Math.random() * 3),
  wfh: Math.floor(Math.random() * 4),
  halfDay: Math.floor(Math.random() * 2),
  workingHours: `${150 + Math.floor(Math.random() * 30)}h`,
  overtime: `${Math.floor(Math.random() * 10)}h`,
}));

const weeklyData = employees.slice(0, 8).map((emp) => ({
  employee: emp,
  mon: ["present", "late", "absent", "wfh", "present"][Math.floor(Math.random() * 5)] as string,
  tue: ["present", "present", "late", "present", "half-day"][Math.floor(Math.random() * 5)] as string,
  wed: ["present", "present", "present", "wfh", "present"][Math.floor(Math.random() * 5)] as string,
  thu: ["present", "late", "present", "present", "casual-leave"][Math.floor(Math.random() * 5)] as string,
  fri: ["present", "present", "absent", "present", "present"][Math.floor(Math.random() * 5)] as string,
  totalHrs: `${36 + Math.floor(Math.random() * 10)}h`,
  overtime: `${Math.floor(Math.random() * 6)}h`,
}));

const todayStats = {
  total: employees.length,
  present: todayAttendance.filter((r) => r.status === "present").length,
  absent: todayAttendance.filter((r) => r.status === "absent").length,
  late: todayAttendance.filter((r) => r.status === "late").length,
  wfh: todayAttendance.filter((r) => r.status === "wfh").length,
  onLeave: todayAttendance.filter((r) => r.status === "casual-leave" || r.status === "sick-leave").length,
  halfDay: todayAttendance.filter((r) => r.status === "half-day").length,
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const [month, setMonth] = useState("july-2026");

  const handleExport = (type: string) => {
    toast.success(`${type} export started`, {
      description: `Your ${period} report is being generated as ${type}. It will download shortly.`,
    });
  };

  const handleEmailReport = () => {
    toast.success("Report emailed", {
      description: "The report has been sent to admin (arjun@company.com) and HR (priya@company.com).",
    });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Attendance and workforce reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("CSV")}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button size="sm" onClick={handleEmailReport} className="bg-primary hover:bg-teal-600 text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Email report
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Tabs value={period} onValueChange={setPeriod} className="flex-1">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={month} onValueChange={(v) => setMonth(v ?? "june")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="july-2026">July 2026</SelectItem>
            <SelectItem value="june-2026">June 2026</SelectItem>
            <SelectItem value="may-2026">May 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Daily Report */}
      {period === "daily" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Daily attendance report — {format(new Date(), "EEEE, MMMM d, yyyy")}</span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-xl font-medium font-mono mt-1">{todayStats.total}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Present</p>
              <p className="text-xl font-medium font-mono text-status-present mt-1">{todayStats.present}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Absent</p>
              <p className="text-xl font-medium font-mono text-status-absent mt-1">{todayStats.absent}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Late</p>
              <p className="text-xl font-medium font-mono text-status-late mt-1">{todayStats.late}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">WFH</p>
              <p className="text-xl font-medium font-mono text-status-wfh mt-1">{todayStats.wfh}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">On leave</p>
              <p className="text-xl font-medium font-mono text-status-leave mt-1">{todayStats.onLeave}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Half day</p>
              <p className="text-xl font-medium font-mono text-status-halfday mt-1">{todayStats.halfDay}</p>
            </Card>
          </div>

          {/* Attendance rate */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Attendance rate</h3>
              <span className="text-2xl font-mono font-medium text-primary">
                {todayStats.total > 0 ? Math.round(((todayStats.present + todayStats.late + todayStats.wfh + todayStats.halfDay) / todayStats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-status-present h-full" style={{ width: `${(todayStats.present / todayStats.total) * 100}%` }} />
              <div className="bg-status-late h-full" style={{ width: `${(todayStats.late / todayStats.total) * 100}%` }} />
              <div className="bg-status-wfh h-full" style={{ width: `${(todayStats.wfh / todayStats.total) * 100}%` }} />
              <div className="bg-status-halfday h-full" style={{ width: `${(todayStats.halfDay / todayStats.total) * 100}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-present" />Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-late" />Late</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-wfh" />WFH</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-halfday" />Half day</span>
            </div>
          </Card>

          {/* Today's detail table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check in</TableHead>
                  <TableHead>Check out</TableHead>
                  <TableHead>Working hrs</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayAttendance.map((rec) => {
                  const emp = getEmployee(rec.employeeId);
                  if (!emp) return null;
                  return (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                              {getInitials(emp.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{emp.name}</p>
                            <p className="text-[11px] text-muted-foreground">{emp.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rec.checkIn || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.checkOut || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.workingHours ? `${rec.workingHours}h` : "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.overtime ? `${rec.overtime}h` : "—"}</TableCell>
                      <TableCell><StatusBadge status={rec.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Alerts */}
          <Card className="p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-status-late" />
              Today&apos;s alerts
            </h3>
            <div className="space-y-2 text-sm">
              {todayAttendance.filter((r) => r.status === "late").map((rec) => {
                const emp = getEmployee(rec.employeeId);
                return emp ? (
                  <div key={rec.id} className="flex items-center gap-2 text-status-late">
                    <Clock className="w-3 h-3" />
                    <span>{emp.name} checked in late at {rec.checkIn}</span>
                  </div>
                ) : null;
              })}
              {todayAttendance.filter((r) => r.status === "absent").map((rec) => {
                const emp = getEmployee(rec.employeeId);
                return emp ? (
                  <div key={rec.id} className="flex items-center gap-2 text-status-absent">
                    <Users className="w-3 h-3" />
                    <span>{emp.name} is absent today</span>
                  </div>
                ) : null;
              })}
              {todayAttendance.filter((r) => r.status === "late").length === 0 && todayAttendance.filter((r) => r.status === "absent").length === 0 && (
                <p className="text-muted-foreground">No alerts for today.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Weekly Report */}
      {period === "weekly" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Weekly report — Jun 30 – Jul 4, 2026</span>
          </div>

          {/* Weekly summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg attendance</p>
              <p className="text-2xl font-medium font-mono text-primary mt-1">89%</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-status-present" /> +2% from last week
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total working hrs</p>
              <p className="text-2xl font-medium font-mono mt-1">384h</p>
              <p className="text-[11px] text-muted-foreground mt-1">Across {employees.length} employees</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total overtime</p>
              <p className="text-2xl font-medium font-mono text-status-halfday mt-1">18h</p>
              <p className="text-[11px] text-muted-foreground mt-1">5 employees with overtime</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Leave taken</p>
              <p className="text-2xl font-medium font-mono text-status-leave mt-1">4</p>
              <p className="text-[11px] text-muted-foreground mt-1">2 casual, 1 sick, 1 earned</p>
            </Card>
          </div>

          {/* Weekly grid */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-center">Mon</TableHead>
                  <TableHead className="text-center">Tue</TableHead>
                  <TableHead className="text-center">Wed</TableHead>
                  <TableHead className="text-center">Thu</TableHead>
                  <TableHead className="text-center">Fri</TableHead>
                  <TableHead className="text-center">Total hrs</TableHead>
                  <TableHead className="text-center">Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map((row) => (
                  <TableRow key={row.employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                            {getInitials(row.employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{row.employee.name}</p>
                          <p className="text-[11px] text-muted-foreground">{row.employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri].map((status, i) => (
                      <TableCell key={i} className="text-center">
                        <StatusBadge status={status as any} />
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-mono text-sm">{row.totalHrs}</TableCell>
                    <TableCell className="text-center font-mono text-sm">{row.overtime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Weekly insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Top performers</h3>
              <div className="space-y-2">
                {employees.slice(0, 3).map((emp, i) => (
                  <div key={emp.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{emp.name}</span>
                    </div>
                    <span className="text-sm font-mono text-primary">{45 - i * 2}h</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Attendance concerns</h3>
              <div className="space-y-2">
                {employees.slice(5, 8).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-status-absent/10 text-status-absent text-[9px] font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{emp.name}</span>
                    </div>
                    <span className="text-xs text-status-late">{Math.floor(Math.random() * 3) + 1} late arrivals</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {period === "monthly" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Monthly report — July 2026</span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg attendance</p>
              <p className="text-2xl font-medium font-mono text-primary mt-1">92%</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total working hrs</p>
              <p className="text-2xl font-medium font-mono mt-1">1,847h</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total overtime</p>
              <p className="text-2xl font-medium font-mono text-status-halfday mt-1">42h</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Leave taken</p>
              <p className="text-2xl font-medium font-mono text-status-leave mt-1">18</p>
            </Card>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Leave</TableHead>
                  <TableHead className="text-center">WFH</TableHead>
                  <TableHead className="text-center">Working hrs</TableHead>
                  <TableHead className="text-center">Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((row) => (
                  <TableRow key={row.employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {getInitials(row.employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{row.employee.name}</p>
                          <p className="text-xs text-muted-foreground">{row.employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm text-status-present">{row.present}</TableCell>
                    <TableCell className="text-center font-mono text-sm text-status-absent">{row.absent}</TableCell>
                    <TableCell className="text-center font-mono text-sm text-status-late">{row.late}</TableCell>
                    <TableCell className="text-center font-mono text-sm text-status-leave">{row.leave}</TableCell>
                    <TableCell className="text-center font-mono text-sm text-status-wfh">{row.wfh}</TableCell>
                    <TableCell className="text-center font-mono text-sm">{row.workingHours}</TableCell>
                    <TableCell className="text-center font-mono text-sm">{row.overtime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
