"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface NetworkSettings {
  officePublicIp: string;
  officeWifiSsid: string;
  ipValidationEnabled: boolean;
  wifiValidationEnabled: boolean;
}

interface NetworkSettingsContextValue {
  settings: NetworkSettings;
  updateSettings: (updates: Partial<NetworkSettings>) => void;
}

const STORAGE_KEY = "attendease_network_settings";

const defaults: NetworkSettings = {
  officePublicIp: "60.243.46.219",
  officeWifiSsid: "DIGITFELLAS",
  ipValidationEnabled: true,
  wifiValidationEnabled: true,
};

function loadSettings(): NetworkSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {}
  return defaults;
}

const NetworkSettingsContext = createContext<NetworkSettingsContextValue>({
  settings: defaults,
  updateSettings: () => {},
});

export function NetworkSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NetworkSettings>(loadSettings);

  const updateSettings = useCallback((updates: Partial<NetworkSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <NetworkSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </NetworkSettingsContext.Provider>
  );
}

export function useNetworkSettings() {
  return useContext(NetworkSettingsContext);
}
