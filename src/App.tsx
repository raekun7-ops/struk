import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Cloud,
  ImageDown,
  Plus,
  RotateCcw,
  Settings,
} from "lucide-react";
import { AmkkmBrinsModal } from "./components/AmkkmBrinsModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { CustomPngModal } from "./components/CustomPngModal";
import { ImagePreviewModal } from "./components/ImagePreviewModal";
import { ReportCard } from "./components/ReportCard";
import { ThemePickerDropdown } from "./components/ThemePickerDropdown";
import { UnitPickerModal } from "./components/UnitPickerModal";
import {
  DEFAULT_UNIT_SETTINGS,
  LOAN_OPTIONS,
  UNITS,
} from "./data/units";
import {
  cloudDeleteReport,
  cloudLoadReport,
  cloudLoadUnitSettings,
  cloudSaveReport,
  cloudSaveUnitSettings,
  getLocalUnitSettings,
  loadLocalState,
  saveLocalState,
  saveLocalUnitSettings,
} from "./services/cloudSync";
import { resolveCharacterTheme } from "./themes/characterThemes";
import type {
  CharacterThemeId,
  CustomThemeAssets,
  ReportState,
  UnitKey,
  UnitSettings,
} from "./types/report";
import { generateReportPngDataUrl } from "./utils/exportPng";
import {
  cloneState,
  getMantriDeb,
  normalizeState,
} from "./utils/format";

export default function App() {
  const [currentUnit, setCurrentUnit] = useState<UnitKey | null>(null);
  const [unitPickerOpen, setUnitPickerOpen] = useState(true);

  const [reportState, setReportState] = useState<ReportState | null>(null);
  const [unitSettings, setUnitSettings] = useState<UnitSettings>({
    ...DEFAULT_UNIT_SETTINGS,
  });
  const [themeId, setThemeId] = useState<CharacterThemeId>("spongebob");
  const [showDate, setShowDate] = useState(true);
  const [selectedLoanToAdd, setSelectedLoanToAdd] = useState<string>("CASHCOL");

  const [syncToast, setSyncToast] = useState<{
    text: string;
    tone: "info" | "ok" | "err";
  } | null>(null);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [customPngModalOpen, setCustomPngModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [exportingPng, setExportingPng] = useState(false);
  const [previewPng, setPreviewPng] = useState<{
    dataUrl: string;
    filename: string;
  } | null>(null);

  const [customAssetsMap, setCustomAssetsMap] = useState<
    Partial<Record<CharacterThemeId, CustomThemeAssets>>
  >(() => {
    try {
      const saved = localStorage.getItem("custom-theme-assets-v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const syncTimerRef = useRef<number | null>(null);
  const toastHideRef = useRef<number | null>(null);

  const activeTheme = useMemo(() => resolveCharacterTheme(themeId), [themeId]);
  const activeCustomAssets = customAssetsMap[activeTheme.id];

  const showToast = useCallback(
    (text: string, tone: "info" | "ok" | "err", autoClearMs?: number) => {
      if (toastHideRef.current) {
        window.clearTimeout(toastHideRef.current);
      }
      setSyncToast({ text, tone });
      if (autoClearMs) {
        toastHideRef.current = window.setTimeout(() => {
          setSyncToast(null);
        }, autoClearMs);
      }
    },
    []
  );

  const scheduleCloudSave = useCallback(
    (unit: UnitKey, nextState: ReportState) => {
      saveLocalState(unit, nextState);
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
      showToast("Menyimpan...", "info");
      syncTimerRef.current = window.setTimeout(async () => {
        const ok = await cloudSaveReport(unit, nextState);
        if (ok) {
          const time = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
          showToast(`Tersimpan (${time})`, "ok", 3000);
        } else {
          showToast("Gagal sync — cek internet", "err", 4000);
        }
      }, 900);
    },
    [showToast]
  );

  const loadUnitData = useCallback(
    async (unitKey: UnitKey) => {
      setCurrentUnit(unitKey);
      setUnitPickerOpen(false);
      sessionStorage.setItem("activeUnit", unitKey);

      // Load theme preference per unit (gracefully migrates old color theme keys to spongebob)
      const savedTheme = localStorage.getItem(`character-theme-${unitKey}`);
      const resolved = resolveCharacterTheme(savedTheme);
      setThemeId(resolved.id);

      // Load date toggle preference
      const savedDate = localStorage.getItem(`date-toggle-${unitKey}`);
      setShowDate(savedDate !== null ? savedDate === "1" : true);

      // Immediate local load
      const localState = loadLocalState(unitKey);
      setReportState(localState);
      setUnitSettings(getLocalUnitSettings(unitKey));

      // Load cloud settings & report
      showToast("Memuat data cloud...", "info");
      const [cloudSettings, cloudState] = await Promise.all([
        cloudLoadUnitSettings(unitKey),
        cloudLoadReport(unitKey),
      ]);

      if (cloudSettings) {
        setUnitSettings(cloudSettings);
        saveLocalUnitSettings(unitKey, cloudSettings);
      }

      if (cloudState) {
        setReportState(cloudState);
        saveLocalState(unitKey, cloudState);
        showToast("Data dimuat dari cloud", "ok", 2500);
      } else {
        setSyncToast(null);
      }
    },
    [showToast]
  );

  // Periodic 30-second cloud refresh while unit is active
  useEffect(() => {
    if (!currentUnit) return;
    const interval = window.setInterval(async () => {
      // Skip overwriting while user is actively typing in an input/textarea
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      const [cloudSettings, cloudState] = await Promise.all([
        cloudLoadUnitSettings(currentUnit),
        cloudLoadReport(currentUnit),
      ]);
      if (cloudSettings) {
        setUnitSettings(cloudSettings);
        saveLocalUnitSettings(currentUnit, cloudSettings);
      }
      if (cloudState) {
        setReportState(cloudState);
        saveLocalState(currentUnit, cloudState);
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, [currentUnit]);

  // Keep selectedLoanToAdd pointing to an unused loan option
  const unusedLoans = useMemo(() => {
    if (!reportState) return [...LOAN_OPTIONS];
    const used = new Set(reportState.loans);
    return LOAN_OPTIONS.filter((loan) => !used.has(loan));
  }, [reportState]);

  useEffect(() => {
    if (unusedLoans.length > 0 && !unusedLoans.includes(selectedLoanToAdd as typeof LOAN_OPTIONS[number])) {
      setSelectedLoanToAdd(unusedLoans[0]);
    }
  }, [unusedLoans, selectedLoanToAdd]);

  const mutateState = useCallback(
    (updater: (draft: ReportState) => ReportState) => {
      if (!currentUnit) return;
      setReportState((prev) => {
        if (!prev) return prev;
        const starter = UNITS[currentUnit].starterData;
        const updated = normalizeState(updater(cloneState(prev)), starter);
        scheduleCloudSave(currentUnit, updated);
        return updated;
      });
    },
    [currentUnit, scheduleCloudSave]
  );

  function handleSelectTheme(nextId: CharacterThemeId) {
    setThemeId(nextId);
    if (currentUnit) {
      localStorage.setItem(`character-theme-${currentUnit}`, nextId);
    }
  }

  function handleToggleDate() {
    setShowDate((prev) => {
      const next = !prev;
      if (currentUnit) {
        localStorage.setItem(`date-toggle-${currentUnit}`, next ? "1" : "0");
      }
      return next;
    });
  }

  function handleAddMantri() {
    mutateState((draft) => {
      const loans: Record<string, number> = {};
      draft.loans.forEach((l) => {
        loans[l] = 0;
      });
      draft.mantri.push({
        name: "Mantri Baru",
        customers: [{ name: "", loans }],
        dhValues: (draft.dhColumns || []).map(() => ""),
      });
      return draft;
    });
  }

  function handleAddLoan() {
    if (!selectedLoanToAdd || !reportState) return;
    if (reportState.loans.includes(selectedLoanToAdd)) return;
    mutateState((draft) => {
      draft.loans.push(selectedLoanToAdd);
      draft.mantri.forEach((m) =>
        m.customers.forEach((c) => {
          c.loans[selectedLoanToAdd] = 0;
        })
      );
      return draft;
    });
  }

  function handleAddDhColumn() {
    mutateState((draft) => {
      if (!Array.isArray(draft.dhColumns)) draft.dhColumns = [];
      draft.dhColumns.push("DH");
      draft.mantri.forEach((m) => {
        if (!Array.isArray(m.dhValues)) m.dhValues = [];
        m.dhValues.push("");
      });
      return draft;
    });
  }

  async function handleManualSync() {
    if (!currentUnit || !reportState) return;
    showToast("Menyinkronkan...", "info");
    const ok = await cloudSaveReport(currentUnit, reportState);
    if (ok) {
      const time = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      showToast(`Tersinkron (${time})`, "ok", 3000);
    } else {
      showToast("Gagal sync — cek internet", "err", 4000);
    }
  }

  async function handleConfirmReset() {
    if (!currentUnit) return;
    setResetModalOpen(false);
    const starter = cloneState(UNITS[currentUnit].starterData);
    localStorage.removeItem(UNITS[currentUnit].storageKey);
    await cloudDeleteReport(currentUnit);
    setReportState(starter);
    showToast("Data unit direset", "ok", 2500);
  }

  async function handleSaveUnitSettings(next: UnitSettings): Promise<boolean> {
    if (!currentUnit) return false;
    setUnitSettings(next);
    saveLocalUnitSettings(currentUnit, next);
    const ok = await cloudSaveUnitSettings(currentUnit, next);
    mutateState((draft) => {
      draft.mantri.forEach((m) => {
        delete m.amkkmOverride;
        delete m.brinsOverride;
      });
      return draft;
    });
    return ok;
  }

  async function handleExportPng() {
    if (!reportState) return;
    setExportingPng(true);
    try {
      const { dataUrl, filename } = await generateReportPngDataUrl(
        reportState,
        activeTheme,
        unitSettings,
        showDate,
        activeCustomAssets
      );

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      if (isIOS || isSafari) {
        setPreviewPng({ dataUrl, filename });
      } else {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = blobUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        window.setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 500);
      }
    } catch {
      showToast("Gagal membuat gambar PNG", "err", 3500);
    } finally {
      setExportingPng(false);
    }
  }

  const totalDebAll = useMemo(() => {
    if (!reportState) return 0;
    return reportState.mantri.reduce(
      (sum, m) => sum + getMantriDeb(m, reportState.loans),
      0
    );
  }, [reportState]);

  return (
    <div className="min-h-screen bg-slate-100/80">
      {unitPickerOpen && (
        <UnitPickerModal
          onSelectUnit={loadUnitData}
          canClose={Boolean(currentUnit)}
          onClose={() => setUnitPickerOpen(false)}
        />
      )}

      {currentUnit && reportState && (
        <div className="mx-auto max-w-[1440px] px-3 py-3 sm:px-6 sm:py-5">
          {/* Top Workspace Action Bar */}
          <header className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUnitPickerOpen(true)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-extrabold text-slate-800 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>Unit: {reportState.title}</span>
              </button>

              {syncToast && (
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    syncToast.tone === "ok"
                      ? "text-emerald-600"
                      : syncToast.tone === "err"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {syncToast.text}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemePickerDropdown
                activeTheme={activeTheme}
                customAssetsMap={customAssetsMap}
                onSelectTheme={handleSelectTheme}
                onOpenCustomPng={() => setCustomPngModalOpen(true)}
              />

              <button
                type="button"
                onClick={handleAddMantri}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-sm font-extrabold text-amber-950 transition-colors hover:bg-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Mantri</span>
              </button>

              <div className="inline-flex items-center gap-1.5">
                <select
                  aria-label="Pilih pinjaman"
                  value={selectedLoanToAdd}
                  onChange={(e) => setSelectedLoanToAdd(e.target.value)}
                  disabled={unusedLoans.length === 0}
                  className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 disabled:opacity-50"
                >
                  {LOAN_OPTIONS.map((loan) => (
                    <option
                      key={loan}
                      value={loan}
                      disabled={reportState.loans.includes(loan)}
                    >
                      {loan}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={unusedLoans.length === 0}
                  onClick={handleAddLoan}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-sm font-extrabold text-amber-950 transition-colors hover:bg-amber-300 disabled:opacity-45 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Pinjaman</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddDhColumn}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-amber-600" />
                <span>DH</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-slate-500" />
                <span>AMKKM/BRINS</span>
              </button>

              <button
                type="button"
                disabled={exportingPng}
                onClick={handleExportPng}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-sm font-extrabold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ImageDown className="h-4 w-4" />
                <span>{exportingPng ? "Membuat..." : "Simpan PNG"}</span>
              </button>

              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                title="Reset data unit"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleManualSync}
                title="Sinkronkan data ke cloud sekarang"
                aria-label="Sync sekarang"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 shrink-0 cursor-pointer"
              >
                <Cloud className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Framed Character-Themed Report Card */}
          <ReportCard
            state={reportState}
            theme={activeTheme}
            customAssets={activeCustomAssets}
            unitSettings={unitSettings}
            showDate={showDate}
            onToggleDate={handleToggleDate}
            onChangeMantriName={(mantriIndex, name) =>
              mutateState((draft) => {
                if (draft.mantri[mantriIndex]) {
                  draft.mantri[mantriIndex].name = name;
                }
                return draft;
              })
            }
            onAddCustomer={(mantriIndex) =>
              mutateState((draft) => {
                const loans: Record<string, number> = {};
                draft.loans.forEach((l) => {
                  loans[l] = 0;
                });
                draft.mantri[mantriIndex]?.customers.push({ name: "", loans });
                return draft;
              })
            }
            onDeleteMantri={(mantriIndex) =>
              mutateState((draft) => {
                if (draft.mantri.length > 1) {
                  draft.mantri.splice(mantriIndex, 1);
                }
                return draft;
              })
            }
            onChangeCustomerName={(mantriIndex, customerIndex, name) =>
              mutateState((draft) => {
                const cust = draft.mantri[mantriIndex]?.customers[customerIndex];
                if (cust) cust.name = name;
                return draft;
              })
            }
            onDeleteCustomer={(mantriIndex, customerIndex) =>
              mutateState((draft) => {
                draft.mantri[mantriIndex]?.customers.splice(customerIndex, 1);
                return draft;
              })
            }
            onChangeCustomerLoan={(mantriIndex, customerIndex, loan, value) =>
              mutateState((draft) => {
                const cust = draft.mantri[mantriIndex]?.customers[customerIndex];
                if (cust) cust.loans[loan] = value;
                return draft;
              })
            }
            onRemoveLoan={(loan) =>
              mutateState((draft) => {
                if (draft.loans.length <= 1) return draft;
                draft.loans = draft.loans.filter((item) => item !== loan);
                draft.mantri.forEach((m) =>
                  m.customers.forEach((c) => {
                    delete c.loans[loan];
                  })
                );
                return draft;
              })
            }
            onChangeInsurance={(mantriIndex, type, value) =>
              mutateState((draft) => {
                const m = draft.mantri[mantriIndex];
                if (m) {
                  if (type === "amkkm") m.amkkmOverride = value;
                  else m.brinsOverride = value;
                }
                return draft;
              })
            }
            onChangeDhValue={(mantriIndex, dhIdx, value) =>
              mutateState((draft) => {
                const m = draft.mantri[mantriIndex];
                if (m) {
                  if (!Array.isArray(m.dhValues)) m.dhValues = [];
                  m.dhValues[dhIdx] = value;
                }
                return draft;
              })
            }
            onRemoveDhColumn={(dhIdx) =>
              mutateState((draft) => {
                draft.dhColumns?.splice(dhIdx, 1);
                draft.mantri.forEach((m) => {
                  if (Array.isArray(m.dhValues)) m.dhValues.splice(dhIdx, 1);
                });
                return draft;
              })
            }
          />
        </div>
      )}

      <AmkkmBrinsModal
        open={settingsModalOpen}
        unitLabel={reportState?.title || ""}
        totalDeb={totalDebAll}
        initialSettings={unitSettings}
        onSave={handleSaveUnitSettings}
        onClose={() => setSettingsModalOpen(false)}
      />

      <ConfirmModal
        open={resetModalOpen}
        title="Reset Data Unit?"
        description="Semua data nasabah dan nominal pada unit ini akan dihapus dari penyimpanan lokal maupun cloud."
        confirmLabel="Ya, Reset"
        cancelLabel="Batal"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />

      <ImagePreviewModal
        dataUrl={previewPng?.dataUrl || null}
        filename={previewPng?.filename || "laporan.png"}
        onClose={() => setPreviewPng(null)}
      />

      <CustomPngModal
        open={customPngModalOpen}
        theme={activeTheme}
        customAssets={activeCustomAssets || {}}
        onSaveAssets={(nextAssets) => {
          setCustomAssetsMap((prev) => {
            const next = { ...prev, [activeTheme.id]: nextAssets };
            try {
              localStorage.setItem(
                "custom-theme-assets-v1",
                JSON.stringify(next)
              );
            } catch {
              showToast("Ukuran gambar terlalu besar untuk disimpan", "err", 3500);
            }
            return next;
          });
        }}
        onClose={() => setCustomPngModalOpen(false)}
      />
    </div>
  );
}
