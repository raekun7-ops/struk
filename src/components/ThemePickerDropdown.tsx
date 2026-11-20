import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ImagePlus } from "lucide-react";
import { CHARACTER_THEME_LIST } from "../themes/characterThemes";
import type {
  CharacterThemeConfig,
  CharacterThemeId,
  CustomThemeAssets,
} from "../types/report";

interface ThemePickerDropdownProps {
  activeTheme: CharacterThemeConfig;
  customAssetsMap: Partial<Record<CharacterThemeId, CustomThemeAssets>>;
  onSelectTheme: (themeId: CharacterThemeId) => void;
  onOpenCustomPng: () => void;
}

export const ThemePickerDropdown: React.FC<ThemePickerDropdownProps> = ({
  activeTheme,
  customAssetsMap,
  onSelectTheme,
  onOpenCustomPng,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const activeAvatarSrc =
    customAssetsMap[activeTheme.id]?.characterDataUrl ||
    activeTheme.characterPngUrl;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
        title="Pilih Tema Karakter"
      >
        <img
          src={activeAvatarSrc}
          alt={activeTheme.name}
          className="h-6 w-6 shrink-0 rounded-lg border border-amber-300 bg-amber-50 object-contain"
        />
        <span>Tema: {activeTheme.name}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="px-2.5 py-1.5 text-xs font-bold tracking-wide text-slate-400 uppercase">
            Tema Karakter
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {CHARACTER_THEME_LIST.map((theme) => {
              const isSelected = theme.id === activeTheme.id;
              const thumbSrc =
                customAssetsMap[theme.id]?.characterDataUrl ||
                theme.characterPngUrl;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-amber-50 ring-1 ring-amber-300"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-0.5"
                    style={{
                      borderColor: theme.frameBorder,
                      background: `linear-gradient(180deg, ${theme.bannerBgStart}, ${theme.bannerBgEnd})`,
                    }}
                  >
                    <img
                      src={thumbSrc}
                      alt={theme.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-slate-900">
                      {theme.name}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {theme.subtitle}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-amber-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenCustomPng();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-extrabold text-white transition-colors hover:bg-slate-800 cursor-pointer"
            >
              <ImagePlus className="h-4 w-4" />
              <span>Upload PNG Karakter / Background</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
