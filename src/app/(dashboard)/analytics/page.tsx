"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const weeklyAttendance = [
  { day: "Mon", present: 52, absent: 3, late: 5 },
  { day: "Tue", present: 54, absent: 2, late: 4 },
  { day: "Wed", present: 50, absent: 4, late: 6 },
  { day: "Thu", present: 48, absent: 5, late: 7 },
  { day: "Fri", present: 45, absent: 8, late: 7 },
];

const monthlyTrend = [
  { month: "Jan", attendance: 94, hours: 168 },
  { month: "Feb", attendance: 92, hours: 162 },
  { month: "Mar", attendance: 96, hours: 172 },
  { month: "Apr", attendance: 91, hours: 160 },
  { month: "May", attendance: 93, hours: 165 },
  { month: "Jun", attendance: 90, hours: 158 },
  { month: "Jul", attendance: 92, hours: 164 },
];

const departmentData = [
  { name: "Development", value: 18, color: "#1D9E75" },
  { name: "Design", value: 6, color: "#378ADD" },
  { name: "QA", value: 5, color: "#7F77DD" },
  { name: "HR", value: 4, color: "#D85A30" },
  { name: "Marketing", value: 5, color: "#EF9F27" },
  { name: "Sales", value: 8, color: "#E24B4A" },
  { name: "Finance", value: 4, color: "#5DCAA5" },
  { name: "Operations", value: 10, color: "#F5C4B3" },
];

const overtimeTrend = [
  { week: "W1", hours: 12 },
  { week: "W2", hours: 18 },
  { week: "W3", hours: 8 },
  { week: "W4", hours: 22 },
];

const leaveTrend = [
  { month: "Jan", casual: 8, sick: 3, earned: 2 },
  { month: "Feb", casual: 6, sick: 5, earned: 1 },
  { month: "Mar", casual: 4, sick: 2, earned: 3 },
  { month: "Apr", casual: 7, sick: 4, earned: 2 },
  { month: "May", casual: 5, sick: 6, earned: 4 },
  { month: "Jun", casual: 9, sick: 3, earned: 1 },
  { month: "Jul", casual: 4, sick: 2, earned: 0 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Attendance and workforce insights
          </p>
        </div>
        <Select defaultValue="july-2026">
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

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Avg attendance
          </p>
          <p className="text-2xl font-medium font-mono text-primary mt-1">
            92%
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            +2% from last month
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            On-time rate
          </p>
          <p className="text-2xl font-medium font-mono mt-1">87%</p>
          <p className="text-[11px] text-status-late mt-1">
            -3% from last month
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Avg working hrs
          </p>
          <p className="text-2xl font-medium font-mono mt-1">8.2h</p>
          <p className="text-[11px] text-muted-foreground mt-1">Per day</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total overtime
          </p>
          <p className="text-2xl font-medium font-mono text-status-halfday mt-1">
            60h
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">This month</p>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Weekly attendance */}
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Weekly attendance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendance} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="present" fill="#1D9E75" radius={[3, 3, 0, 0]} />
              <Bar dataKey="late" fill="#D85A30" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" fill="#E24B4A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department distribution */}
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Department distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {departmentData.map((dept) => (
                <div
                  key={dept.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-muted-foreground">{dept.name}</span>
                  </div>
                  <span className="font-mono font-medium">{dept.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Monthly attendance trend */}
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">
            Monthly attendance trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[80, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}%`, "Attendance"]}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#1D9E75"
                fill="#1D9E75"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Leave trend */}
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Leave trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={leaveTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="casual"
                stroke="#1D9E75"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="sick"
                stroke="#E24B4A"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="earned"
                stroke="#378ADD"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[#1D9E75]" />
              Casual
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[#E24B4A]" />
              Sick
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[#378ADD]" />
              Earned
            </div>
          </div>
        </Card>
      </div>

      {/* Overtime bar */}
      <Card className="p-5">
        <h3 className="text-sm font-medium mb-4">Weekly overtime</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={overtimeTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}h`} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}h`, "Overtime"]}
            />
            <Bar dataKey="hours" fill="#EF9F27" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
