"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Shield, Users, Wifi, WifiOff, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { useNetworkSettings } from "@/lib/network-settings";

function generateQrMatrix(data: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const setFinderPattern = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6) matrix[row + r][col + c] = true;
        else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) matrix[row + r][col + c] = true;
      }
    }
  };

  setFinderPattern(0, 0);
  setFinderPattern(0, size - 7);
  setFinderPattern(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  for (let r = 9; r < size - 8; r++) {
    for (let c = 9; c < size - 8; c++) {
      hash = ((hash << 5) - hash + r * 31 + c * 17) | 0;
      matrix[r][c] = (hash & 1) === 1;
    }
  }
  for (let r = 9; r < size - 8; r++) {
    for (let c = 0; c < 8; c++) {
      hash = ((hash << 5) - hash + r * 13 + c * 7) | 0;
      if (r !== 6) matrix[r][c] = (hash & 1) === 1;
    }
  }
  for (let r = 0; r < 8; r++) {
    for (let c = 9; c < size - 8; c++) {
      hash = ((hash << 5) - hash + r * 11 + c * 23) | 0;
      if (c !== 6) matrix[r][c] = (hash & 1) === 1;
    }
  }

  return matrix;
}

function QrCodeSvg({ data, size = 180 }: { data: string; size?: number }) {
  const matrix = generateQrMatrix(data);
  const cellSize = size / matrix.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <rect width={size} height={size} fill="white" rx="4" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111827"
              rx={cellSize * 0.15}
            />
          ) : null
        )
      )}
    </svg>
  );
}

type LoginMode = "credentials" | "qr";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<LoginMode>("credentials");
  const [networkStatus, setNetworkStatus] = useState<"checking" | "office" | "external">("checking");
  const [currentIp, setCurrentIp] = useState("");
  const [qrToken] = useState(() => `attendease-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  const [qrScanned, setQrScanned] = useState(false);
  const [demoOverride, setDemoOverride] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const { settings: networkSettings } = useNetworkSettings();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function checkNetwork() {
      try {
        const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        const ip = data.ip || "unknown";
        setCurrentIp(ip);

        if (!networkSettings.officePublicIp) {
          setNetworkStatus("office");
          return;
        }
        const isOfficeIp = ip === networkSettings.officePublicIp;
        setNetworkStatus(isOfficeIp ? "office" : "external");
      } catch {
        setCurrentIp("unknown");
        setNetworkStatus("external");
      }
    }
    checkNetwork();
  }, [networkSettings.officePublicIp]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (networkStatus === "external" && !demoOverride) {
      setError("Login is restricted to the office network. Please connect to office WiFi to sign in.");
      return;
    }

    if (networkStatus === "checking") {
      setError("Network check in progress. Please wait...");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Login failed");
      }
      setSubmitting(false);
    }, 500);
  }, [email, password, networkStatus, demoOverride, login, router]);

  const quickLogin = useCallback((qEmail: string, role: string) => {
    if (networkStatus === "external" && !demoOverride) {
      setError("Login is restricted to the office network. Please connect to office WiFi to sign in.");
      return;
    }
    if (networkStatus === "checking") {
      setError("Network check in progress. Please wait...");
      return;
    }

    const pwd = role === "admin" ? "admin123" : "emp123";
    setEmail(qEmail);
    setPassword(pwd);
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      const result = login(qEmail, pwd);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Login failed");
      }
      setSubmitting(false);
    }, 400);
  }, [networkStatus, demoOverride, login, router]);

  const simulateQrScan = useCallback(() => {
    if (networkStatus === "external" && !demoOverride) {
      setError("QR login is restricted to the office network.");
      return;
    }
    setQrScanned(true);
    setSubmitting(true);
    setTimeout(() => {
      const result = login("sara@company.com", "emp123");
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Login failed");
        setQrScanned(false);
      }
      setSubmitting(false);
    }, 1500);
  }, [networkStatus, demoOverride, login, router]);

  if (loading || isAuthenticated) {
    return null;
  }

  const isOffice = networkStatus === "office" || demoOverride;
  const isChecking = networkStatus === "checking";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold mx-auto mb-4">
            A
          </div>
          <h1 className="text-xl font-semibold tracking-tight">AttendEase</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Network status indicator */}
        {isChecking ? (
          <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-3 bg-muted text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying network access...</span>
          </div>
        ) : isOffice ? (
          <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Wifi className="w-4 h-4" />
            <span>{demoOverride ? "Demo mode active" : "Office network verified"}</span>
          </div>
        ) : (
          <div className="rounded-lg mb-3 border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
              <WifiOff className="w-5 h-5" />
              <span>Access Restricted</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400/80">
              You must be connected to the <strong>{networkSettings.officeWifiSsid}</strong> office WiFi network to sign in.
            </p>
            <p className="text-xs text-red-500/70 dark:text-red-400/50 mt-1.5">
              Your IP: {currentIp} • Required: {networkSettings.officePublicIp}
            </p>
          </div>
        )}

        {/* Mode toggle — only show when access is allowed */}
        {(isOffice || isChecking) && (
        <div className="flex gap-1 bg-muted rounded-lg p-1 mb-3">
          <button
            onClick={() => { setMode("credentials"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-md transition-colors ${
              mode === "credentials" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Credentials
          </button>
          <button
            onClick={() => { setMode("qr"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-md transition-colors ${
              mode === "qr" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </button>
        </div>
        )}

        {!isOffice && !isChecking && !demoOverride ? (
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-semibold text-lg mb-1">Login Blocked</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This application can only be accessed from the office WiFi network ({networkSettings.officeWifiSsid}).
            </p>
            <div className="text-xs text-muted-foreground space-y-1 bg-muted rounded-lg p-3">
              <p>Please ensure you are:</p>
              <ul className="list-disc list-inside text-left space-y-0.5 mt-1">
                <li>Connected to <strong>{networkSettings.officeWifiSsid}</strong> WiFi</li>
                <li>Physically present in the office</li>
                <li>Not using a VPN or mobile hotspot</li>
              </ul>
            </div>
          </Card>
        ) : mode === "credentials" ? (
          <>
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                    disabled={!isOffice && !isChecking}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!isOffice && !isChecking}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || (!isOffice && !isChecking)}
                  className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Card>

            {/* Quick login helpers */}
            <Card className="p-4 mt-3">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
                Demo accounts
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin("arjun@company.com", "admin")}
                  disabled={!isOffice}
                  className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Shield className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Admin login</p>
                    <p className="text-[11px] text-muted-foreground">
                      arjun@company.com / admin123
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => quickLogin("priya@company.com", "admin")}
                  disabled={!isOffice}
                  className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Shield className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">HR login</p>
                    <p className="text-[11px] text-muted-foreground">
                      priya@company.com / admin123
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => quickLogin("vignesh@company.com", "employee")}
                  disabled={!isOffice}
                  className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Manager login</p>
                    <p className="text-[11px] text-muted-foreground">
                      vignesh@company.com / emp123
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => quickLogin("sara@company.com", "employee")}
                  disabled={!isOffice}
                  className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Employee login</p>
                    <p className="text-[11px] text-muted-foreground">
                      sara@company.com / emp123
                    </p>
                  </div>
                </button>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your phone to sign in
              </p>

              <div className={`inline-block p-3 bg-white rounded-xl border border-border shadow-sm ${!isOffice ? "opacity-40 blur-[2px]" : ""}`}>
                <QrCodeSvg data={qrToken} size={180} />
              </div>

              {!isOffice && !isChecking && (
                <p className="text-sm text-destructive mt-3">
                  QR login requires office WiFi connection
                </p>
              )}

              {isOffice && (
                <>
                  <p className="text-xs text-muted-foreground mt-3">
                    QR code refreshes every 30 seconds
                  </p>

                  {qrScanned ? (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <Button
                      onClick={simulateQrScan}
                      disabled={submitting}
                      variant="outline"
                      className="mt-4 w-full"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Simulate QR scan (demo)
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        )}

        {/* Demo override for testing outside office network */}
        {networkStatus === "external" && (
          <div className="mt-3">
            <button
              onClick={() => { setDemoOverride((v) => !v); setError(""); }}
              className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {demoOverride ? "✓ Demo mode: Office WiFi simulated — click to disable" : "Not on office WiFi? Enable demo mode to test"}
            </button>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground mt-3">
          Contact your HR administrator if you need access
        </p>
      </div>
    </div>
  );
}
