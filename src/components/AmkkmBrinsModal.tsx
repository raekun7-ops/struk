import React, { useEffect, useState } from "react";
import { Shield, X } from "lucide-react";
import type { UnitSettings } from "../types/report";
import { formatRupiah, parseNumber } from "../utils/format";

interface AmkkmBrinsModalProps {
  open: boolean;
  unitLabel: string;
  totalDeb: number;
  initialSettings: UnitSettings;
  onSave: (settings: UnitSettings) => Promise<boolean>;
  onClose: () => void;
}

export const AmkkmBrinsModal: React.FC<AmkkmBrinsModalProps> = ({
  open,
  unitLabel,
  totalDeb,
  initialSettings,
  onSave,
  onClose,
}) => {
  const [amkkmText, setAmkkmText] = useState("");
  const [brinsText, setBrinsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (open) {
      setAmkkmText(initialSettings.amkkm ? formatRupiah(initialSettings.amkkm) : "");
      setBrinsText(initialSettings.brins ? formatRupiah(initialSettings.brins) : "");
      setStatusMsg(null);
    }
  }, [open, initialSettings]);

  if (!open) return null;

  const amkkmNum = parseNumber(amkkmText);
  const brinsNum = parseNumber(brinsText);

  async function handleSave() {
    setSaving(true);
    setStatusMsg({ text: "Menyimpan ke cloud...", ok: true });
    const ok = await onSave({ amkkm: amkkmNum, brins: brinsNum });
    setSaving(false);
    setStatusMsg({
      text: ok
        ? "Tersimpan di cloud dan diterapkan."
        : "Gagal simpan ke cloud, tersimpan lokal.",
      ok,
    });
    if (ok) {
      setTimeout(() => {
        onClose();
      }, 900);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Setting AMKKM & BRINS
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Unit {unitLabel} · Nominal per 1 debitur (DEB)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              AMKKM — Nominal per DEB (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 150000"
              value={amkkmText}
              onFocus={() => setAmkkmText(amkkmNum ? String(amkkmNum) : "")}
              onBlur={() => setAmkkmText(amkkmNum ? formatRupiah(amkkmNum) : "")}
              onChange={(e) => setAmkkmText(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center text-lg font-extrabold text-slate-900 tabular-nums outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
            {amkkmNum > 0 && (
              <p className="mt-1 text-center text-xs font-semibold text-slate-500 tabular-nums">
                {totalDeb > 0
                  ? `${totalDeb} DEB × ${formatRupiah(amkkmNum)} = ${formatRupiah(
                      amkkmNum * totalDeb
                    )}`
                  : `Rp ${formatRupiah(amkkmNum)} per DEB`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              BRINS — Nominal per DEB (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 180000"
              value={brinsText}
              onFocus={() => setBrinsText(brinsNum ? String(brinsNum) : "")}
              onBlur={() => setBrinsText(brinsNum ? formatRupiah(brinsNum) : "")}
              onChange={(e) => setBrinsText(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center text-lg font-extrabold text-slate-900 tabular-nums outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
            {brinsNum > 0 && (
              <p className="mt-1 text-center text-xs font-semibold text-slate-500 tabular-nums">
                {totalDeb > 0
                  ? `${totalDeb} DEB × ${formatRupiah(brinsNum)} = ${formatRupiah(
                      brinsNum * totalDeb
                    )}`
                  : `Rp ${formatRupiah(brinsNum)} per DEB`}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          Nilai AMKKM dan BRINS dihitung otomatis dari Total DEB mantri dikali nominal di atas, dan tetap dapat diubah manual per mantri.
        </p>

        {statusMsg && (
          <p
            className={`mt-3 text-center text-xs font-bold ${
              statusMsg.ok ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {statusMsg.text}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 min-h-11 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-amber-950 hover:bg-amber-300 disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Simpan & Terapkan"}
          </button>
        </div>
      </div>
    </div>
  );
};
