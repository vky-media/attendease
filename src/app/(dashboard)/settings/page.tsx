"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Wifi, WifiOff, Mail, Clock, Shield, Check, Crosshair, Loader2 } from "lucide-react";
import { employees, getInitials } from "@/lib/mock-data";
import { useNetworkSettings } from "@/lib/network-settings";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const { settings: networkSettings, updateSettings: updateNetworkSettings } = useNetworkSettings();
  const [detectingIp, setDetectingIp] = useState(false);
  const [currentIp, setCurrentIp] = useState("");
  const [wifiRestrictions, setWifiRestrictions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    employees.forEach((e) => { initial[e.id] = true; });
    return initial;
  });
  const [emailDailyReport, setEmailDailyReport] = useState(true);
  const [emailWeeklyReport, setEmailWeeklyReport] = useState(true);
  const [emailLeaveRequest, setEmailLeaveRequest] = useState(true);
  const [emailPermissionRequest, setEmailPermissionRequest] = useState(true);
  const [emailWfhRequest, setEmailWfhRequest] = useState(true);
  const [emailApproval, setEmailApproval] = useState(true);
  const [adminEmail, setAdminEmail] = useState("webdevvicky@gmail.com");
  const [hrEmail, setHrEmail] = useState("priya@company.com");
  const [dailyReportTime, setDailyReportTime] = useState("18:00");
  const [weeklyReportDay, setWeeklyReportDay] = useState("friday");

  const toggleWifiRestriction = (empId: string) => {
    setWifiRestrictions((prev) => ({ ...prev, [empId]: !prev[empId] }));
  };

  const handleSaveNetwork = () => {
    const restricted = Object.values(wifiRestrictions).filter(Boolean).length;
    toast.success("Network settings saved", {
      description: `WiFi restriction applied to ${restricted} of ${employees.length} employees.`,
    });
  };

  const handleSaveEmail = () => {
    toast.success("Email notification settings saved", {
      description: `Notifications will be sent to ${adminEmail} and ${hrEmail}.`,
    });
  };

  const handleSaveReport = () => {
    toast.success("Report schedule saved", {
      description: `Daily report at ${dailyReportTime}, weekly report on ${weeklyReportDay}.`,
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure company, attendance, network, and notification settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave policy</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="email">Email & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card className="p-6 space-y-5">
            <div>
              <Label>Company name</Label>
              <Input defaultValue="TechFlow Solutions" className="mt-1.5 max-w-md" />
            </div>
            <div>
              <Label>Office address</Label>
              <Input
                defaultValue="42, Anna Salai, Chennai 600002"
                className="mt-1.5 max-w-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Time zone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                    <SelectItem value="pst">PST (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div>
              <Label>Working days</Label>
              <div className="flex gap-2 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <button
                      key={day}
                      className={`w-10 h-10 rounded-lg text-xs font-medium border transition-colors ${
                        ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={() => toast.success("Company settings saved")}
              >
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Shift start</Label>
                <Input type="time" defaultValue="09:00" className="mt-1.5" />
              </div>
              <div>
                <Label>Shift end</Label>
                <Input type="time" defaultValue="18:00" className="mt-1.5" />
              </div>
            </div>
            <div className="max-w-md">
              <Label>Grace period (minutes)</Label>
              <Input
                type="number"
                defaultValue="15"
                className="mt-1.5 w-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Employees arriving within this window won&apos;t be marked late
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Break settings</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <Label>Tea break (min)</Label>
                  <Input type="number" defaultValue="15" className="mt-1.5" />
                </div>
                <div>
                  <Label>Lunch break (min)</Label>
                  <Input type="number" defaultValue="45" className="mt-1.5" />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Features</h3>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">GPS tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Record location when marking attendance
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Auto checkout</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically checkout at shift end
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Overtime tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Track hours beyond shift end
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={() => toast.success("Attendance settings saved")}
              >
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-medium">Annual leave allocation</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Casual leave</Label>
                <Input type="number" defaultValue="12" className="mt-1.5" />
              </div>
              <div>
                <Label>Sick leave</Label>
                <Input type="number" defaultValue="10" className="mt-1.5" />
              </div>
              <div>
                <Label>Earned leave</Label>
                <Input type="number" defaultValue="15" className="mt-1.5" />
              </div>
              <div>
                <Label>Paid leave</Label>
                <Input type="number" defaultValue="10" className="mt-1.5" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Permission settings</h3>
              <div className="max-w-md">
                <Label>Monthly permission limit (hours)</Label>
                <Input type="number" defaultValue="4" className="mt-1.5 w-24" />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Carry forward unused leave</p>
                  <p className="text-xs text-muted-foreground">
                    Allow carrying unused leave to next year
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={() => toast.success("Leave policy saved")}
              >
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="mt-4 space-y-4">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-3">
                Office network validation
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Employees can only log in and mark attendance when connected to
                your office WiFi. The system detects the user&apos;s public IP and compares it against the saved office IP.
              </p>

              {/* How it works */}
              <div className="bg-muted/50 rounded-lg p-3 mb-4 text-xs space-y-1.5">
                <p className="font-medium text-foreground text-sm">How WiFi restriction works</p>
                <p className="text-muted-foreground">1. Connect to your office WiFi (<strong>{networkSettings.officeWifiSsid || "your SSID"}</strong>) and click &quot;Detect my IP&quot; to save your office&apos;s public IP.</p>
                <p className="text-muted-foreground">2. When an employee opens the login page, the system detects their public IP automatically.</p>
                <p className="text-muted-foreground">3. If their IP <strong>matches</strong> the saved office IP → login is <strong className="text-status-present">allowed</strong> (they&apos;re on office WiFi).</p>
                <p className="text-muted-foreground">4. If their IP <strong>doesn&apos;t match</strong> → login is <strong className="text-status-absent">blocked</strong> (they&apos;re on a different network).</p>
              </div>

              <div className="space-y-3 max-w-md">
                {/* Current IP detection */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Your current IP:</span>
                  <span className="font-mono font-medium">{currentIp || "—"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    disabled={detectingIp}
                    onClick={async () => {
                      setDetectingIp(true);
                      try {
                        const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(5000) });
                        const data = await res.json();
                        setCurrentIp(data.ip || "unknown");
                      } catch {
                        setCurrentIp("error");
                      }
                      setDetectingIp(false);
                    }}
                  >
                    {detectingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : "Refresh"}
                  </Button>
                  {currentIp && networkSettings.officePublicIp && (
                    <span className={`text-xs font-medium ${currentIp === networkSettings.officePublicIp ? "text-status-present" : "text-status-absent"}`}>
                      {currentIp === networkSettings.officePublicIp ? "✓ Matches office IP" : "✗ Different from office IP"}
                    </span>
                  )}
                </div>

                <div>
                  <Label>Saved office public IP</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={networkSettings.officePublicIp}
                      onChange={(e) => updateNetworkSettings({ officePublicIp: e.target.value })}
                      placeholder="Not set — click Detect to capture"
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={detectingIp}
                      className="shrink-0 whitespace-nowrap"
                      onClick={async () => {
                        setDetectingIp(true);
                        try {
                          const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(5000) });
                          const data = await res.json();
                          const ip = data.ip || "";
                          setCurrentIp(ip);
                          updateNetworkSettings({ officePublicIp: ip });
                          toast.success("Office IP saved", {
                            description: `Your public IP ${ip} has been saved as the office IP. Only users on this network can log in.`,
                          });
                        } catch {
                          toast.error("Could not detect IP", { description: "Check your internet connection and try again." });
                        }
                        setDetectingIp(false);
                      }}
                    >
                      {detectingIp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4 mr-1" />}
                      {detectingIp ? "Detecting..." : "Detect my IP"}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {networkSettings.officePublicIp
                      ? `Employees must be on a network with public IP ${networkSettings.officePublicIp} to log in.`
                      : "No IP set — WiFi restriction is currently disabled. Set your office IP to enable it."}
                  </p>
                </div>
                <div>
                  <Label>Office WiFi name (SSID)</Label>
                  <Input
                    value={networkSettings.officeWifiSsid}
                    onChange={(e) => updateNetworkSettings({ officeWifiSsid: e.target.value })}
                    placeholder="e.g. DIGITFELLAS"
                    className="mt-1.5 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Shown on the login page so employees know which WiFi to connect to.
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Validation methods</h3>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">IP address validation</p>
                  <p className="text-xs text-muted-foreground">
                    Match employee IP against office IP
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">WiFi SSID validation</p>
                  <p className="text-xs text-muted-foreground">
                    Check connected WiFi network name
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">GPS location validation</p>
                  <p className="text-xs text-muted-foreground">
                    Verify employee is within office radius
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">VPN detection</p>
                  <p className="text-xs text-muted-foreground">
                    Block attendance when using a VPN
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Per-employee WiFi restriction */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  WiFi restriction per employee
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable or disable office WiFi restriction for each employee. Disabled employees can log in from any network.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-primary" /> Restricted
                </span>
                <span className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-muted-foreground" /> Unrestricted
                </span>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">WiFi restricted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                            {getInitials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{emp.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {emp.designation}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={wifiRestrictions[emp.id] ?? true}
                        onCheckedChange={() => toggleWifiRestriction(emp.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="pt-4">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={handleSaveNetwork}
              >
                Save network settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4 space-y-4">
          {/* Email recipients */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-primary" />
                Email notification recipients
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Notifications for leave, WFH, permission requests, and approvals will be sent to these addresses.
              </p>
              <div className="space-y-3 max-w-md">
                <div>
                  <Label>Admin email</Label>
                  <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="mt-1.5 font-mono"
                  />
                </div>
                <div>
                  <Label>HR email</Label>
                  <Input
                    type="email"
                    value={hrEmail}
                    onChange={(e) => setHrEmail(e.target.value)}
                    className="mt-1.5 font-mono"
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Notification triggers</h3>
              <p className="text-xs text-muted-foreground">
                Choose which events trigger email notifications to admin and HR.
              </p>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Leave request submitted</p>
                  <p className="text-xs text-muted-foreground">
                    When an employee applies for leave
                  </p>
                </div>
                <Switch checked={emailLeaveRequest} onCheckedChange={setEmailLeaveRequest} />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">WFH request submitted</p>
                  <p className="text-xs text-muted-foreground">
                    When an employee requests work from home
                  </p>
                </div>
                <Switch checked={emailWfhRequest} onCheckedChange={setEmailWfhRequest} />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Permission request submitted</p>
                  <p className="text-xs text-muted-foreground">
                    When an employee requests permission to leave early
                  </p>
                </div>
                <Switch checked={emailPermissionRequest} onCheckedChange={setEmailPermissionRequest} />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Request approved / rejected</p>
                  <p className="text-xs text-muted-foreground">
                    When a manager approves or rejects a request
                  </p>
                </div>
                <Switch checked={emailApproval} onCheckedChange={setEmailApproval} />
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={handleSaveEmail}
              >
                Save email settings
              </Button>
            </div>
          </Card>

          {/* Report scheduling */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                Automated report schedule
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Automatically send attendance and workforce reports to admin and HR via email.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm font-medium">Daily attendance report</p>
                  <p className="text-xs text-muted-foreground">
                    Summary of today&apos;s attendance, late arrivals, absentees, and leave
                  </p>
                </div>
                <Switch checked={emailDailyReport} onCheckedChange={setEmailDailyReport} />
              </div>
              {emailDailyReport && (
                <div className="max-w-md pl-0">
                  <Label>Send daily report at</Label>
                  <Input
                    type="time"
                    value={dailyReportTime}
                    onChange={(e) => setDailyReportTime(e.target.value)}
                    className="mt-1.5 w-32"
                  />
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm font-medium">Weekly summary report</p>
                  <p className="text-xs text-muted-foreground">
                    Attendance trends, overtime hours, leave summary, and workforce analytics
                  </p>
                </div>
                <Switch checked={emailWeeklyReport} onCheckedChange={setEmailWeeklyReport} />
              </div>
              {emailWeeklyReport && (
                <div className="max-w-md pl-0">
                  <Label>Send weekly report on</Label>
                  <Select value={weeklyReportDay} onValueChange={(v) => setWeeklyReportDay(v ?? "monday")}>
                    <SelectTrigger className="mt-1.5 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="pt-2">
              <Button
                className="bg-primary hover:bg-teal-600 text-primary-foreground"
                onClick={handleSaveReport}
              >
                Save report schedule
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
