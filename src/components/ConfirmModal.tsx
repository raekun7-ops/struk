import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  danger = true,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 min-h-11 rounded-xl px-4 py-2 text-sm font-extrabold text-white transition-colors cursor-pointer ${
              danger
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
