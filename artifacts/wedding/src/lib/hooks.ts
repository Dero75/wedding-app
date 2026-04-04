import { useState, useEffect } from "react";
import { AdminSettings, getAdminSettings, saveAdminSettings, DEFAULT_ADMIN_SETTINGS } from "./storage";

export function useAdminSettings() {
  const [settings, setSettingsState] = useState<AdminSettings>(() => getAdminSettings());

  const setSettings = (next: AdminSettings) => {
    setSettingsState(next);
    saveAdminSettings(next);
  };

  const updateSettings = (partial: Partial<AdminSettings>) => {
    setSettings({ ...settings, ...partial });
  };

  return { settings, setSettings, updateSettings };
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem("wedding_" + key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem("wedding_" + key, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return [value, set] as const;
}

export function useTheme() {
  const [settings] = useState(() => getAdminSettings());
  return settings.stylePreset;
}

export function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}
