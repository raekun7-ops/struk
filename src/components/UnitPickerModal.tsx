import React, { useState } from "react";
import { Building2, Lock, Settings, ShieldCheck, X } from "lucide-react";
import { ADMIN_PASSWORD, UNIT_LIST } from "../data/units";
import {
  cloudLoadPasswords,
  cloudSavePasswords,
  getLocalUnitPasswords,
  saveLocalUnitPasswords,
} from "../services/cloudSync";
import type { UnitKey } from "../types/report";

interface UnitPickerModalProps {
  onSelectUnit: (unitKey: UnitKey) => void;
  canClose?: boolean;
  onClose?: () => void;
}

export const UnitPickerModal: React.FC<UnitPickerModalProps> = ({
  onSelectUnit,
  canClose = false,
  onClose,
}) => {
  const [checkingUnit, setCheckingUnit] = useState<UnitKey | null>(null);
  const [passwordModal, setPasswordModal] = useState<{
    unitKey: UnitKey;
    unitLabel: string;
    correctPw: string;
  } | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminPwError, setAdminPwError] = useState("");

  const [adminEditorOpen, setAdminEditorOpen] = useState(false);
  const [adminPasswords, setAdminPasswords] = useState<Record<string, string>>({});
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminMsg, setAdminMsg] = useState<{ text: string; ok: boolean } | null>(
    null
  );

  async function handlePickUnit(unitKey: UnitKey, label: string) {
    setCheckingUnit(unitKey);
    const cloudPw = await cloudLoadPasswords();
    if (cloudPw) {
      saveLocalUnitPasswords(cloudPw);
    }
    const passwords = cloudPw || getLocalUnitPasswords();
    const requiredPw = passwords[unitKey];
    setCheckingUnit(null);

    if (requiredPw && requiredPw.trim() !== "") {
      setPwInput("");
      setPwError("");
      setPasswordModal({
        unitKey,
        unitLabel: label,
        correctPw: requiredPw,
      });
    } else {
      onSelectUnit(unitKey);
    }
  }

  function submitUnitPassword() {
    if (!passwordModal) return;
    if (pwInput.toUpperCase() === passwordModal.correctPw.toUpperCase()) {
      const unitKey = passwordModal.unitKey;
      setPasswordModal(null);
      onSelectUnit(unitKey);
    } else {
      setPwError("Password salah. Coba lagi.");
      setPwInput("");
    }
  }

  async function submitAdminPassword() {
    if (adminPwInput.toUpperCase() === ADMIN_PASSWORD.toUpperCase()) {
      setAdminPromptOpen(false);
      setAdminPwInput("");
      setAdminPwError("");
      setAdminEditorOpen(true);
      setAdminLoading(true);
      setAdminMsg(null);
      const cloudPw = await cloudLoadPasswords();
      const current = cloudPw || getLocalUnitPasswords();
      if (cloudPw) saveLocalUnitPasswords(cloudPw);
      setAdminPasswords(current);
      setAdminLoading(false);
    } else {
      setAdminPwError("Password admin salah.");
      setAdminPwInput("");
    }
  }

  async function handleSaveAdminPasswords() {
    setAdminSaving(true);
    setAdminMsg({ text: "Menyimpan ke cloud...", ok: true });
    const cleaned: Record<string, string> = {};
    UNIT_LIST.forEach((u) => {
      cleaned[u.key] = (adminPasswords[u.key] || "").trim().toUpperCase();
    });
    saveLocalUnitPasswords(cleaned);
    const ok = await cloudSavePasswords(cleaned);
    setAdminSaving(false);
    setAdminMsg({
      text: ok
        ? "Password tersimpan di cloud dan berlaku di semua perangkat."
        : "Gagal simpan ke cloud. Cek koneksi internet.",
      ok,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-gradient-to-b from-amber-50/90 via-white to-amber-50/70 p-4 sm:p-6">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-300 bg-white p-6 sm:p-8 shadow-xl">
        {canClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-sm">
            <Building2 className="h-7 w-7" />
          </div>
          <p className="mt-4 text-xs font-extrabold tracking-widest text-amber-700 uppercase">
            Pilih Unit
          </p>
          <h1 className="mt-1 font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            LAPORAN HARIAN
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2.5">
          {UNIT_LIST.map((u) => (
            <button
              key={u.key}
              type="button"
              disabled={checkingUnit !== null}
              onClick={() => handlePickUnit(u.key, u.label)}
              className="flex min-h-13 w-full items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-base font-extrabold tracking-wide text-amber-950 shadow-xs transition-all hover:bg-amber-300 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {checkingUnit === u.key ? "Memeriksa..." : u.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setAdminPwInput("");
              setAdminPwError("");
              setAdminPromptOpen(true);
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Admin Password Unit
          </button>
        </div>
      </div>

      {/* Password prompt for unit */}
      {passwordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
          onClick={() => setPasswordModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-slate-900">
              {passwordModal.unitLabel}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Masukkan password untuk membuka unit ini
            </p>
            <input
              type="password"
              autoFocus
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitUnitPassword();
              }}
              placeholder="Password..."
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center text-base font-extrabold tracking-widest text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
            {pwError && (
              <p className="mt-2 text-xs font-bold text-rose-600">{pwError}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setPasswordModal(null)}
                className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitUnitPassword}
                className="flex-1 min-h-11 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-amber-950 hover:bg-amber-300 cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin auth prompt */}
      {adminPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
          onClick={() => setAdminPromptOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-slate-900">
              Panel Admin
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Masukkan password admin
            </p>
            <input
              type="password"
              autoFocus
              value={adminPwInput}
              onChange={(e) => setAdminPwInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAdminPassword();
              }}
              placeholder="Password admin..."
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center text-base font-extrabold tracking-widest text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
            {adminPwError && (
              <p className="mt-2 text-xs font-bold text-rose-600">{adminPwError}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setAdminPromptOpen(false)}
                className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitAdminPassword}
                className="flex-1 min-h-11 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin password editor */}
      {adminEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-xs"
          onClick={() => setAdminEditorOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-slate-900">
              Atur Password Unit
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Kosongkan jika unit tidak memerlukan password.
            </p>

            {adminLoading ? (
              <div className="py-10 text-center text-sm font-bold text-slate-500">
                Memuat password dari cloud...
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {UNIT_LIST.map((u) => (
                  <div
                    key={u.key}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="w-36 shrink-0 text-xs font-extrabold text-slate-800">
                      {u.label}
                    </span>
                    <input
                      type="text"
                      placeholder="Tanpa password"
                      value={adminPasswords[u.key] || ""}
                      onChange={(e) =>
                        setAdminPasswords((prev) => ({
                          ...prev,
                          [u.key]: e.target.value.toUpperCase(),
                        }))
                      }
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {adminMsg && (
              <p
                className={`mt-3 text-center text-xs font-bold ${
                  adminMsg.ok ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {adminMsg.text}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setAdminEditorOpen(false)}
                className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={adminSaving || adminLoading}
                onClick={handleSaveAdminPasswords}
                className="flex-1 min-h-11 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-amber-950 hover:bg-amber-300 disabled:opacity-60 cursor-pointer"
              >
                {adminSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
