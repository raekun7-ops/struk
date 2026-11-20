import React, { useState } from "react";
import { ImagePlus, RotateCcw, Upload, X } from "lucide-react";
import type { CharacterThemeConfig, CustomThemeAssets } from "../types/report";

interface CustomPngModalProps {
  open: boolean;
  theme: CharacterThemeConfig;
  customAssets: CustomThemeAssets;
  onSaveAssets: (next: CustomThemeAssets) => void;
  onClose: () => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export const CustomPngModal: React.FC<CustomPngModalProps> = ({
  open,
  theme,
  customAssets,
  onSaveAssets,
  onClose,
}) => {
  const [charDraft, setCharDraft] = useState<string | undefined>(
    customAssets.characterDataUrl
  );
  const [bgDraft, setBgDraft] = useState<string | undefined>(
    customAssets.backgroundDataUrl
  );
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (open) {
      setCharDraft(customAssets.characterDataUrl);
      setBgDraft(customAssets.backgroundDataUrl);
      setErrorMsg("");
    }
  }, [open, customAssets]);

  if (!open) return null;

  async function handleFilePick(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "char" | "bg"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 4 MB agar tersimpan lancar.");
      return;
    }
    try {
      setErrorMsg("");
      const dataUrl = await readFileAsDataUrl(file);
      if (target === "char") setCharDraft(dataUrl);
      else setBgDraft(dataUrl);
    } catch {
      setErrorMsg("Gagal memuat gambar. Pastikan format PNG/JPG/WEBP.");
    }
  }

  function handleSave() {
    onSaveAssets({
      characterDataUrl: charDraft,
      backgroundDataUrl: bgDraft,
    });
    onClose();
  }

  const activeCharPreview = charDraft || theme.characterPngUrl;
  const activeBgPreview = bgDraft || theme.backgroundPngUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Upload PNG Manual — {theme.name}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Atau ganti langsung file di folder{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] font-bold text-slate-700">
                  public/themes/{theme.id}/
                </code>
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
          {/* Character PNG slot */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  1. Gambar Karakter (PNG Transparan)
                </h3>
                <p className="text-xs text-slate-500">
                  File default: <code>/themes/{theme.id}/character.png</code>
                </p>
              </div>
              {charDraft && (
                <button
                  type="button"
                  onClick={() => setCharDraft(undefined)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Default
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                <img
                  src={activeCharPreview}
                  alt={theme.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-amber-950 transition-colors hover:bg-amber-300">
                <Upload className="h-4 w-4" />
                <span>Pilih PNG Karakter</span>
                <input
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  className="hidden"
                  onChange={(e) => handleFilePick(e, "char")}
                />
              </label>
            </div>
          </div>

          {/* Background PNG slot */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  2. Gambar Background Header (PNG/JPG)
                </h3>
                <p className="text-xs text-slate-500">
                  File default: <code>/themes/{theme.id}/background.png</code>
                </p>
              </div>
              {bgDraft && (
                <button
                  type="button"
                  onClick={() => setBgDraft(undefined)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Default
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={activeBgPreview}
                  alt="Background"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-amber-950 transition-colors hover:bg-amber-300">
                <Upload className="h-4 w-4" />
                <span>Pilih PNG Background</span>
                <input
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  className="hidden"
                  onChange={(e) => handleFilePick(e, "bg")}
                />
              </label>
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs font-bold text-rose-600">{errorMsg}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-h-11 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 cursor-pointer"
          >
            Terapkan Gambar
          </button>
        </div>
      </div>
    </div>
  );
};
