import {
  DEFAULT_UNIT_SETTINGS,
  UNIT_PASSWORDS_KEY,
  UNIT_SETTINGS_KEY,
  UNITS,
} from "../data/units";
import type { ReportState, UnitKey, UnitSettings } from "../types/report";
import { cloneState, normalizeState } from "../utils/format";

export const DB_URL =
  "https://laporan-margasari-default-rtdb.asia-southeast1.firebasedatabase.app";

export function getLocalUnitPasswords(): Record<string, string> {
  try {
    const saved = localStorage.getItem(UNIT_PASSWORDS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveLocalUnitPasswords(passwords: Record<string, string>): void {
  localStorage.setItem(UNIT_PASSWORDS_KEY, JSON.stringify(passwords));
}

export async function cloudLoadPasswords(): Promise<Record<string, string> | null> {
  try {
    const r = await fetch(`${DB_URL}/passwords.json`);
    if (!r.ok) return null;
    const data = await r.json();
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export async function cloudSavePasswords(
  passwords: Record<string, string>
): Promise<boolean> {
  try {
    const r = await fetch(`${DB_URL}/passwords.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwords),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export function loadLocalState(unitKey: UnitKey): ReportState {
  const { storageKey, oldStorageKey, starterData } = UNITS[unitKey];
  const saved = localStorage.getItem(storageKey);
  const oldSaved = oldStorageKey ? localStorage.getItem(oldStorageKey) : null;
  try {
    if (saved) return normalizeState(JSON.parse(saved), starterData);
    if (oldSaved) return normalizeState(JSON.parse(oldSaved), starterData);
  } catch {
    return cloneState(starterData);
  }
  return cloneState(starterData);
}

export function saveLocalState(unitKey: UnitKey, state: ReportState): void {
  localStorage.setItem(UNITS[unitKey].storageKey, JSON.stringify(state));
}

export async function cloudLoadReport(
  unitKey: UnitKey
): Promise<ReportState | null> {
  const { starterData } = UNITS[unitKey];
  try {
    const r = await fetch(`${DB_URL}/units/${unitKey}.json`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (data && typeof data === "object" && data.mantri) {
      return normalizeState(data, starterData);
    }
    return null;
  } catch {
    return null;
  }
}

export async function cloudSaveReport(
  unitKey: UnitKey,
  state: ReportState
): Promise<boolean> {
  try {
    const r = await fetch(`${DB_URL}/units/${unitKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function cloudDeleteReport(unitKey: UnitKey): Promise<boolean> {
  try {
    const r = await fetch(`${DB_URL}/units/${unitKey}.json`, {
      method: "DELETE",
    });
    return r.ok;
  } catch {
    return false;
  }
}

export function getLocalUnitSettings(unitKey: UnitKey): UnitSettings {
  try {
    const local = localStorage.getItem(`${UNIT_SETTINGS_KEY}-${unitKey}`);
    if (local) {
      return { ...DEFAULT_UNIT_SETTINGS, ...JSON.parse(local) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_UNIT_SETTINGS };
}

export function saveLocalUnitSettings(
  unitKey: UnitKey,
  settings: UnitSettings
): void {
  localStorage.setItem(
    `${UNIT_SETTINGS_KEY}-${unitKey}`,
    JSON.stringify(settings)
  );
}

export async function cloudLoadUnitSettings(
  unitKey: UnitKey
): Promise<UnitSettings | null> {
  try {
    const r = await fetch(`${DB_URL}/settings/${unitKey}.json`);
    if (!r.ok) return null;
    const data = await r.json();
    return data && typeof data === "object"
      ? { ...DEFAULT_UNIT_SETTINGS, ...data }
      : null;
  } catch {
    return null;
  }
}

export async function cloudSaveUnitSettings(
  unitKey: UnitKey,
  settings: UnitSettings
): Promise<boolean> {
  try {
    const r = await fetch(`${DB_URL}/settings/${unitKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return r.ok;
  } catch {
    return false;
  }
}
