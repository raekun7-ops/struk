import React from "react";
import { Download, X } from "lucide-react";

interface ImagePreviewModalProps {
  dataUrl: string | null;
  filename: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  dataUrl,
  filename,
  onClose,
}) => {
  if (!dataUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-slate-950/85 p-4 sm:p-6 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium text-white/85">
            Pratinjau laporan PNG. Tekan Unduh atau tekan lama gambar untuk menyimpan.
          </p>
          <div className="flex items-center gap-2">
            <a
              href={dataUrl}
              download={filename}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-amber-950 transition-colors hover:bg-amber-300"
            >
              <Download className="h-4 w-4" />
              Unduh PNG
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/25 cursor-pointer"
            >
              <X className="h-4 w-4" />
              Tutup
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <img
            src={dataUrl}
            alt={filename}
            className="block w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};
