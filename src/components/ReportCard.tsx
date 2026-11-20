import React from "react";
import { Plus, X } from "lucide-react";
import { getMantriPN } from "../data/units";
import type {
  CharacterThemeConfig,
  ReportState,
  UnitSettings,
} from "../types/report";
import {
  formatRupiah,
  getCustomerLoanValue,
  getIndonesianDate,
  getLoanDeb,
  getMantriDeb,
  getMantriTotal,
  parseNumber,
} from "../utils/format";

interface ReportCardProps {
  state: ReportState;
  theme: CharacterThemeConfig;
  customAssets?: import("../types/report").CustomThemeAssets;
  unitSettings: UnitSettings;
  showDate: boolean;
  onToggleDate: () => void;
  onChangeMantriName: (mantriIndex: number, name: string) => void;
  onAddCustomer: (mantriIndex: number) => void;
  onDeleteMantri: (mantriIndex: number) => void;
  onChangeCustomerName: (
    mantriIndex: number,
    customerIndex: number,
    name: string
  ) => void;
  onDeleteCustomer: (mantriIndex: number, customerIndex: number) => void;
  onChangeCustomerLoan: (
    mantriIndex: number,
    customerIndex: number,
    loan: string,
    value: number
  ) => void;
  onRemoveLoan: (loan: string) => void;
  onChangeInsurance: (
    mantriIndex: number,
    type: "amkkm" | "brins",
    value: number
  ) => void;
  onChangeDhValue: (mantriIndex: number, dhIdx: number, value: string) => void;
  onRemoveDhColumn: (dhIdx: number) => void;
}

const BannerAmbientOverlay: React.FC<{ theme: CharacterThemeConfig }> = ({
  theme,
}) => {
  if (theme.id === "spongebob") {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* SpongeBob Bikini Bottom Sky Flowers & Bubbles */}
        <g stroke="rgba(225, 148, 0, 0.42)" strokeWidth="2.5" fill="none">
          <g transform="translate(56, 62) rotate(-14)">
            <path d="M0 -18 C7 -18 9 -6 2 -3 C12 -6 20 1 16 9 C11 16 2 8 2 4 C8 12 2 22 -6 19 C-14 15 -7 6 -3 3 C-12 7 -20 -1 -15 -9 C-10 -16 -2 -8 -1 -4 C-6 -12 -5 -18 0 -18 Z" />
            <circle cx="0" cy="1" r="4.5" />
          </g>
          <g transform="translate(915, 42) rotate(12) scale(0.82)">
            <path
              stroke="rgba(224, 114, 18, 0.55)"
              d="M0 -18 C7 -18 9 -6 2 -3 C12 -6 20 1 16 9 C11 16 2 8 2 4 C8 12 2 22 -6 19 C-14 15 -7 6 -3 3 C-12 7 -20 -1 -15 -9 C-10 -16 -2 -8 -1 -4 C-6 -12 -5 -18 0 -18 Z"
            />
            <circle stroke="rgba(224, 114, 18, 0.55)" cx="0" cy="1" r="4.5" />
          </g>
          <g transform="translate(1118, 56) rotate(22) scale(1.1)">
            <path d="M0 -18 C7 -18 9 -6 2 -3 C12 -6 20 1 16 9 C11 16 2 8 2 4 C8 12 2 22 -6 19 C-14 15 -7 6 -3 3 C-12 7 -20 -1 -15 -9 C-10 -16 -2 -8 -1 -4 C-6 -12 -5 -18 0 -18 Z" />
            <circle cx="0" cy="1" r="4.5" />
          </g>
        </g>
        <g stroke="rgba(218, 165, 0, 0.42)" strokeWidth="2" fill="rgba(255,255,255,0.45)">
          <circle cx="132" cy="40" r="14" />
          <circle cx="328" cy="112" r="11" />
          <circle cx="348" cy="126" r="7" />
          <circle cx="1010" cy="36" r="12" />
        </g>
      </svg>
    );
  }

  if (theme.id === "woody") {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="#D67A00" strokeWidth="2" strokeLinejoin="round">
          <polygon
            transform="translate(68, 64) rotate(-18)"
            points="0,-18 5,-6 18,-6 7,3 11,16 0,8 -11,16 -7,3 -18,-6 -5,-6"
            fill="#FFAC1C"
          />
          <polygon
            transform="translate(972, 38) rotate(-12) scale(0.75)"
            points="0,-18 5,-6 18,-6 7,3 11,16 0,8 -11,16 -7,3 -18,-6 -5,-6"
            fill="#FFBF24"
          />
          <polygon
            transform="translate(1148, 56) rotate(14) scale(0.95)"
            points="0,-18 5,-6 18,-6 7,3 11,16 0,8 -11,16 -7,3 -18,-6 -5,-6"
            fill="#FFAC1C"
          />
        </g>
        <g fill="#F5B700">
          <path d="M52 110 L55 120 L65 123 L55 126 L52 136 L49 126 L39 123 L49 120 Z" />
          <path d="M1088 58 L1091 66 L1099 69 L1091 72 L1088 80 L1085 72 L1077 69 L1085 66 Z" />
        </g>
      </svg>
    );
  }

  if (theme.id === "pikachu") {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="#FFE124" stroke="#D47A00" strokeWidth="2" strokeLinejoin="round">
          <polygon points="74,34 58,64 70,64 62,92 86,58 73,58" />
          <polygon points="1138,32 1122,62 1134,62 1126,90 1150,56 1137,56" />
        </g>
        <g fill="#F59E0B">
          <path d="M985 30 L988 38 L996 41 L988 44 L985 52 L982 44 L974 41 L982 38 Z" />
          <path d="M342 32 L344 39 L351 41 L344 43 L342 50 L340 43 L333 41 L340 39 Z" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="rgba(255,255,255,0.88)" stroke="#8AC7F0" strokeWidth="2">
        <path d="M46 72 C36 72 30 62 36 53 C39 42 54 39 62 46 C69 40 83 45 83 56 C91 58 91 72 80 72 Z" />
        <path d="M1086 68 C1076 68 1070 58 1076 49 C1079 38 1094 35 1102 42 C1109 36 1123 41 1123 52 C1131 54 1131 68 1120 68 Z" />
      </g>
      <polygon
        transform="translate(972, 38) scale(0.75)"
        points="0,-16 4,-5 16,-5 6,3 10,15 0,7 -10,15 -6,3 -16,-5 -4,-5"
        fill="#FFD426"
        stroke="#D48800"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ReportCard: React.FC<ReportCardProps> = ({
  state,
  theme,
  customAssets,
  unitSettings,
  showDate,
  onToggleDate,
  onChangeMantriName,
  onAddCustomer,
  onDeleteMantri,
  onChangeCustomerName,
  onDeleteCustomer,
  onChangeCustomerLoan,
  onRemoveLoan,
  onChangeInsurance,
  onChangeDhValue,
  onRemoveDhColumn,
}) => {
  const [charPngFailed, setCharPngFailed] = React.useState(false);
  const [bgPngFailed, setBgPngFailed] = React.useState(false);

  const charPngSrc = customAssets?.characterDataUrl || theme.characterPngUrl;
  const bgPngSrc = customAssets?.backgroundDataUrl || theme.backgroundPngUrl;

  React.useEffect(() => {
    setCharPngFailed(false);
  }, [charPngSrc]);

  React.useEffect(() => {
    setBgPngFailed(false);
  }, [bgPngSrc]);

  const [focusedLoanInput, setFocusedLoanInput] = React.useState<{
    key: string;
    raw: string;
  } | null>(null);
  const [focusedInsInput, setFocusedInsInput] = React.useState<{
    key: string;
    raw: string;
  } | null>(null);
  const [focusedDhInput, setFocusedDhInput] = React.useState<{
    key: string;
    raw: string;
  } | null>(null);

  const grandTotal = state.mantri.reduce(
    (sum, mantri) => sum + getMantriTotal(mantri, state.loans),
    0
  );
  const grandDeb = state.mantri.reduce(
    (sum, mantri) => sum + getMantriDeb(mantri, state.loans),
    0
  );
  const dhColumns = state.dhColumns || [];
  const dhTotals = dhColumns.map((_, dhIdx) =>
    state.mantri.reduce((sum, mantri) => {
      const raw = Array.isArray(mantri.dhValues) ? mantri.dhValues[dhIdx] : "";
      return sum + (raw !== undefined && raw !== "" ? parseNumber(String(raw)) : 0);
    }, 0)
  );

  const dateText = getIndonesianDate();
  const colSpanRealisasi = 3 + state.loans.length * 2 + 1;

  return (
    <section
      aria-label="Laporan pinjaman"
      className="mx-auto w-full overflow-hidden rounded-3xl bg-white shadow-xl"
      style={{
        border: `3px solid ${theme.frameBorder}`,
      }}
    >
      {/* Character Header Banner */}
      <div
        className="relative flex flex-col items-center justify-between gap-3 overflow-hidden px-4 pt-3 pb-2 sm:flex-row sm:px-8 sm:py-0 sm:min-h-[128px]"
        style={{
          background: `linear-gradient(180deg, ${theme.bannerBgStart} 0%, ${theme.bannerBgEnd} 100%)`,
        }}
      >
        {/* Background PNG (from public/themes/<id>/background.png or custom upload) */}
        {!bgPngFailed && (
          <img
            src={bgPngSrc}
            alt=""
            aria-hidden="true"
            onError={() => setBgPngFailed(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Ambient vector overlay only when using default built-in background */}
        {!customAssets?.backgroundDataUrl && <BannerAmbientOverlay theme={theme} />}

        {/* Left Character PNG (from public/themes/<id>/character.png or custom upload) */}
        <div className="relative z-10 flex shrink-0 items-end justify-center sm:ml-8 sm:self-end">
          {!charPngFailed ? (
            <img
              src={charPngSrc}
              alt={theme.name}
              onError={() => setCharPngFailed(true)}
              className="h-[108px] w-[148px] sm:h-[126px] sm:w-[174px] -mb-0.5 object-contain object-bottom select-none"
            />
          ) : (
            <div
              className="h-[108px] w-[148px] sm:h-[126px] sm:w-[174px] -mb-0.5 select-none"
              dangerouslySetInnerHTML={{ __html: theme.characterSvg }}
            />
          )}
        </div>

        {/* Center Outlined Unit Title (Two-Layer Stack for 100% visibility) */}
        <div className="relative z-10 flex-1 text-center py-1">
          <h1 className="report-banner-title relative inline-block text-3xl sm:text-5xl lg:text-6xl select-none">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                color: theme.titleStroke,
                WebkitTextStroke: "10px " + theme.titleStroke,
                filter: `drop-shadow(0 4px 6px ${theme.titleShadow})`,
              }}
            >
              {state.title}
            </span>
            <span
              className="relative z-10"
              style={{
                backgroundImage: `linear-gradient(180deg, ${theme.titleFillTop}, ${theme.titleFillBottom})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: theme.titleFillBottom,
              }}
            >
              {state.title}
            </span>
          </h1>
        </div>

        {/* Right Interactive Date Badge */}
        <div className="relative z-10 mb-2 flex shrink-0 items-center sm:mb-0">
          <label
            title="Centang untuk menampilkan tanggal pada ekspor PNG"
            className={`inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-xs transition-opacity cursor-pointer select-none ${
              showDate ? "opacity-100" : "opacity-55"
            }`}
            style={{
              border: `2px solid ${theme.dateBorder}`,
              color: theme.dateText,
            }}
          >
            <input
              type="checkbox"
              checked={showDate}
              onChange={onToggleDate}
              className="no-print h-3.5 w-3.5 accent-amber-500 cursor-pointer"
            />
            <span className="whitespace-nowrap">{dateText}</span>
          </label>
        </div>
      </div>

      {/* Report Table */}
      <div className="w-full overflow-x-auto bg-white">
        <table className="w-full min-w-[980px] border-collapse bg-white text-center">
          <thead>
            <tr
              style={{
                background: `linear-gradient(180deg, ${theme.tableHeadStart}, ${theme.tableHeadEnd})`,
                color: theme.tableHeadText,
              }}
            >
              <th
                rowSpan={2}
                className="w-16 px-2 py-3 text-base font-extrabold"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                No
              </th>
              <th
                rowSpan={2}
                className="min-w-[165px] px-3 py-3 text-base font-extrabold"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                Mantri
              </th>
              <th
                rowSpan={2}
                className="min-w-[210px] px-3 py-3 text-base font-extrabold leading-tight"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                Nama
                <br />
                Nasabah
              </th>
              {state.loans.map((loan) => (
                <th
                  key={loan}
                  colSpan={2}
                  className="relative min-w-[230px] px-8 py-2.5 text-base font-extrabold"
                  style={{ border: `1px solid ${theme.tableLine}` }}
                >
                  <span>{loan}</span>
                  {state.loans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveLoan(loan)}
                      title={`Hapus pinjaman ${loan}`}
                      aria-label={`Hapus pinjaman ${loan}`}
                      className="no-print absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-xs font-extrabold text-white hover:bg-rose-700 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </th>
              ))}
              <th
                rowSpan={2}
                className="min-w-[140px] px-3 py-3 text-base font-extrabold leading-tight"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                Total
                <br />
                OS
              </th>
              <th
                rowSpan={2}
                className="min-w-[110px] px-3 py-3 text-base font-extrabold leading-tight"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                Total
                <br />
                DEB
              </th>
              <th
                rowSpan={2}
                className="min-w-[130px] px-3 py-3 text-base font-extrabold"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                AMKKM
              </th>
              <th
                rowSpan={2}
                className="min-w-[130px] px-3 py-3 text-base font-extrabold"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                BRINS
              </th>
              {dhColumns.map((dhName, dhIdx) => (
                <th
                  key={`${dhName}-${dhIdx}`}
                  rowSpan={2}
                  className="relative min-w-[145px] px-7 py-3 text-base font-extrabold"
                  style={{ border: `1px solid ${theme.tableLine}` }}
                >
                  <span>{dhName}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveDhColumn(dhIdx)}
                    title={`Hapus kolom ${dhName}`}
                    aria-label={`Hapus kolom ${dhName}`}
                    className="no-print absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-xs font-extrabold text-white hover:bg-rose-700 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </th>
              ))}
            </tr>
            <tr
              style={{
                background: `linear-gradient(180deg, ${theme.tableHeadStart}, ${theme.tableHeadEnd})`,
                color: theme.tableHeadText,
              }}
            >
              {state.loans.map((loan) => (
                <React.Fragment key={`${loan}-sub`}>
                  <th
                    className="w-20 px-2 py-2 text-sm font-extrabold"
                    style={{ border: `1px solid ${theme.tableLine}` }}
                  >
                    DEB
                  </th>
                  <th
                    className="min-w-[150px] px-2 py-2 text-sm font-extrabold"
                    style={{ border: `1px solid ${theme.tableLine}` }}
                  >
                    OS
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {state.mantri.map((mantri, mantriIndex) => {
              const customers = mantri.customers.length
                ? mantri.customers
                : [{ name: "", loans: {}, empty: true }];
              const rowSpan = customers.length;
              const mantriTotal = getMantriTotal(mantri, state.loans);
              const mantriDeb = getMantriDeb(mantri, state.loans);
              const amkkmAuto = mantriDeb * (unitSettings.amkkm || 0);
              const brinsAuto = mantriDeb * (unitSettings.brins || 0);
              const pn = getMantriPN(mantri.name);
              const rowBg = mantriIndex % 2 === 0 ? "#ffffff" : theme.rowAltBg;

              const amkkmKey = `${mantriIndex}-amkkm`;
              const brinsKey = `${mantriIndex}-brins`;
              const amkkmVal =
                mantri.amkkmOverride !== undefined
                  ? mantri.amkkmOverride
                  : amkkmAuto;
              const brinsVal =
                mantri.brinsOverride !== undefined
                  ? mantri.brinsOverride
                  : brinsAuto;

              return customers.map((customer, customerIndex) => {
                const isFirst = customerIndex === 0;
                const isEmpty = Boolean(customer.empty);

                return (
                  <tr
                    key={`${mantriIndex}-${customerIndex}`}
                    style={{ backgroundColor: rowBg }}
                  >
                    {isFirst && (
                      <td
                        rowSpan={rowSpan}
                        className="px-2 py-2.5 align-middle"
                        style={{ border: `1px solid ${theme.tableLine}` }}
                      >
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg font-extrabold text-white shadow-xs tabular-nums"
                          style={{
                            background: `linear-gradient(180deg, ${theme.badgeBgStart}, ${theme.badgeBgEnd})`,
                          }}
                        >
                          {mantriIndex + 1}
                        </span>
                      </td>
                    )}

                    {isFirst && (
                      <td
                        rowSpan={rowSpan}
                        className="px-2 py-2.5 align-middle"
                        style={{ border: `1px solid ${theme.tableLine}` }}
                      >
                        <div className="flex flex-col items-center">
                          <textarea
                            rows={1}
                            value={mantri.name}
                            aria-label="Nama mantri"
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height = `${e.target.scrollHeight}px`;
                              onChangeMantriName(mantriIndex, e.target.value);
                            }}
                            className="w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-1.5 py-0.5 text-center text-sm sm:text-base font-extrabold outline-none focus:border-amber-400 focus:bg-amber-50/70"
                            style={{ color: theme.inkPrimary }}
                          />
                          {pn && (
                            <span
                              className="text-xs font-bold tracking-wider tabular-nums"
                              style={{ color: theme.inkMuted }}
                            >
                              PN {pn}
                            </span>
                          )}
                          <div className="no-print mt-1.5 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onAddCustomer(mantriIndex)}
                              title="Tambah nasabah"
                              aria-label="Tambah nasabah"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-extrabold text-white shadow-xs transition-transform hover:scale-105 cursor-pointer"
                              style={{
                                background: `linear-gradient(180deg, ${theme.badgeBgStart}, ${theme.badgeBgEnd})`,
                              }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            {state.mantri.length > 1 && (
                              <button
                                type="button"
                                onClick={() => onDeleteMantri(mantriIndex)}
                                title="Hapus mantri"
                                aria-label="Hapus mantri"
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-600 text-xs font-extrabold text-white shadow-xs transition-transform hover:scale-105 hover:bg-rose-700 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Nama Nasabah */}
                    <td
                      className="px-2 py-2 align-middle"
                      style={{ border: `1px solid ${theme.tableLine}` }}
                    >
                      {isEmpty ? (
                        <span
                          className="text-base font-extrabold"
                          style={{ color: theme.inkPrimary }}
                        >
                          -
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <textarea
                            rows={1}
                            value={customer.name}
                            placeholder="Nama nasabah..."
                            aria-label="Nama nasabah"
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height = `${e.target.scrollHeight}px`;
                              onChangeCustomerName(
                                mantriIndex,
                                customerIndex,
                                e.target.value
                              );
                            }}
                            className="w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-2 py-1 text-center text-sm sm:text-base font-bold outline-none placeholder:text-slate-400 focus:border-amber-400 focus:bg-amber-50/70"
                            style={{ color: theme.inkPrimary }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onDeleteCustomer(mantriIndex, customerIndex)
                            }
                            title="Hapus nasabah"
                            aria-label="Hapus nasabah"
                            className="no-print flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Loan DEB & OS */}
                    {state.loans.map((loan) => {
                      const loanDeb = getLoanDeb(mantri, loan);
                      const osVal = getCustomerLoanValue(customer, loan);
                      const otherFilledLoan = state.loans.find(
                        (l) => l !== loan && getCustomerLoanValue(customer, l) > 0
                      );
                      const cellKey = `${mantriIndex}-${customerIndex}-${loan}`;
                      const isFocused = focusedLoanInput?.key === cellKey;

                      return (
                        <React.Fragment key={`${loan}-${customerIndex}`}>
                          {isFirst && (
                            <td
                              rowSpan={rowSpan}
                              className="px-2 py-2.5 align-middle text-base font-extrabold tabular-nums"
                              style={{
                                border: `1px solid ${theme.tableLine}`,
                                color: theme.inkPrimary,
                              }}
                            >
                              {loanDeb > 0 ? loanDeb : ""}
                            </td>
                          )}
                          <td
                            className="px-2 py-2 align-middle"
                            style={{ border: `1px solid ${theme.tableLine}` }}
                          >
                            {isEmpty ? (
                              <span
                                className="text-base font-extrabold"
                                style={{ color: theme.inkPrimary }}
                              >
                                -
                              </span>
                            ) : (
                              <input
                                type="text"
                                inputMode="numeric"
                                disabled={Boolean(otherFilledLoan)}
                                title={
                                  otherFilledLoan
                                    ? `OS sudah diisi di kolom ${otherFilledLoan}`
                                    : ""
                                }
                                placeholder="0"
                                aria-label={`OS ${loan}`}
                                value={
                                  isFocused
                                    ? focusedLoanInput.raw
                                    : osVal > 0
                                    ? formatRupiah(osVal)
                                    : ""
                                }
                                onFocus={() =>
                                  setFocusedLoanInput({
                                    key: cellKey,
                                    raw: osVal > 0 ? String(osVal) : "",
                                  })
                                }
                                onBlur={() => setFocusedLoanInput(null)}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  setFocusedLoanInput({ key: cellKey, raw });
                                  onChangeCustomerLoan(
                                    mantriIndex,
                                    customerIndex,
                                    loan,
                                    parseNumber(raw)
                                  );
                                }}
                                className={`h-9 w-full rounded-lg border border-transparent px-2 text-center text-sm sm:text-base font-extrabold tabular-nums outline-none placeholder:text-slate-300 focus:border-amber-400 focus:bg-amber-50/70 ${
                                  otherFilledLoan
                                    ? "cursor-not-allowed bg-slate-100/70 opacity-35"
                                    : "bg-transparent"
                                }`}
                                style={{ color: theme.inkPrimary }}
                              />
                            )}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Total OS, Total DEB, AMKKM, BRINS, DH */}
                    {isFirst && (
                      <>
                        <td
                          rowSpan={rowSpan}
                          className="px-2.5 py-2.5 align-middle text-base font-extrabold whitespace-nowrap tabular-nums"
                          style={{
                            border: `1px solid ${theme.tableLine}`,
                            color: theme.inkPrimary,
                          }}
                        >
                          {mantriTotal > 0 ? formatRupiah(mantriTotal) : ""}
                        </td>
                        <td
                          rowSpan={rowSpan}
                          className="px-2 py-2.5 align-middle text-base font-extrabold tabular-nums"
                          style={{
                            border: `1px solid ${theme.tableLine}`,
                            color: theme.inkPrimary,
                          }}
                        >
                          {mantriDeb > 0 ? mantriDeb : ""}
                        </td>
                        <td
                          rowSpan={rowSpan}
                          className="px-2 py-2.5 align-middle"
                          style={{ border: `1px solid ${theme.tableLine}` }}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            aria-label="AMKKM"
                            value={
                              focusedInsInput?.key === amkkmKey
                                ? focusedInsInput.raw
                                : amkkmVal > 0
                                ? formatRupiah(amkkmVal)
                                : ""
                            }
                            placeholder="0"
                            onFocus={() =>
                              setFocusedInsInput({
                                key: amkkmKey,
                                raw: amkkmVal > 0 ? String(amkkmVal) : "",
                              })
                            }
                            onBlur={() => setFocusedInsInput(null)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setFocusedInsInput({ key: amkkmKey, raw });
                              onChangeInsurance(
                                mantriIndex,
                                "amkkm",
                                parseNumber(raw)
                              );
                            }}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-1.5 text-center text-sm sm:text-base font-extrabold tabular-nums outline-none placeholder:text-slate-300 focus:border-amber-400 focus:bg-amber-50/70"
                            style={{ color: theme.inkPrimary }}
                          />
                        </td>
                        <td
                          rowSpan={rowSpan}
                          className="px-2 py-2.5 align-middle"
                          style={{ border: `1px solid ${theme.tableLine}` }}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            aria-label="BRINS"
                            value={
                              focusedInsInput?.key === brinsKey
                                ? focusedInsInput.raw
                                : brinsVal > 0
                                ? formatRupiah(brinsVal)
                                : ""
                            }
                            placeholder="0"
                            onFocus={() =>
                              setFocusedInsInput({
                                key: brinsKey,
                                raw: brinsVal > 0 ? String(brinsVal) : "",
                              })
                            }
                            onBlur={() => setFocusedInsInput(null)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setFocusedInsInput({ key: brinsKey, raw });
                              onChangeInsurance(
                                mantriIndex,
                                "brins",
                                parseNumber(raw)
                              );
                            }}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-1.5 text-center text-sm sm:text-base font-extrabold tabular-nums outline-none placeholder:text-slate-300 focus:border-amber-400 focus:bg-amber-50/70"
                            style={{ color: theme.inkPrimary }}
                          />
                        </td>
                        {dhColumns.map((dhName, dhIdx) => {
                          const dhKey = `${mantriIndex}-dh-${dhIdx}`;
                          const dhRaw = Array.isArray(mantri.dhValues)
                            ? mantri.dhValues[dhIdx] || ""
                            : "";
                          const dhNum = dhRaw ? parseNumber(dhRaw) : 0;
                          return (
                            <td
                              key={dhKey}
                              rowSpan={rowSpan}
                              className="px-2 py-2.5 align-middle"
                              style={{ border: `1px solid ${theme.tableLine}` }}
                            >
                              <input
                                type="text"
                                inputMode="numeric"
                                aria-label={dhName}
                                value={
                                  focusedDhInput?.key === dhKey
                                    ? focusedDhInput.raw
                                    : dhNum > 0
                                    ? formatRupiah(dhNum)
                                    : ""
                                }
                                placeholder="0"
                                onFocus={() =>
                                  setFocusedDhInput({
                                    key: dhKey,
                                    raw: dhNum > 0 ? String(dhNum) : "",
                                  })
                                }
                                onBlur={() => {
                                  if (focusedDhInput?.key === dhKey) {
                                    const n = parseNumber(focusedDhInput.raw);
                                    onChangeDhValue(
                                      mantriIndex,
                                      dhIdx,
                                      n > 0 ? String(n) : ""
                                    );
                                  }
                                  setFocusedDhInput(null);
                                }}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  setFocusedDhInput({ key: dhKey, raw });
                                  onChangeDhValue(mantriIndex, dhIdx, raw);
                                }}
                                className="h-9 w-full rounded-lg border border-transparent bg-transparent px-1.5 text-center text-sm sm:text-base font-extrabold tabular-nums outline-none placeholder:text-slate-300 focus:border-amber-400 focus:bg-amber-50/70"
                                style={{ color: theme.inkPrimary }}
                              />
                            </td>
                          );
                        })}
                      </>
                    )}
                  </tr>
                );
              });
            })}
          </tbody>

          <tfoot>
            <tr
              style={{
                background: `linear-gradient(180deg, ${theme.footBgStart}, ${theme.footBgEnd})`,
              }}
            >
              <td
                colSpan={colSpanRealisasi}
                className="px-4 py-4 text-left"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-xs"
                    style={{
                      background: `linear-gradient(180deg, ${theme.badgeBgStart}, ${theme.badgeBgEnd})`,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-base sm:text-lg font-extrabold tracking-wide uppercase"
                    style={{ color: theme.inkPrimary }}
                  >
                    Total Realisasi
                  </span>
                  <strong
                    className="ml-3 text-xl sm:text-2xl font-black tabular-nums"
                    style={{ color: theme.footAccent }}
                  >
                    {formatRupiah(grandTotal)}
                  </strong>
                </div>
              </td>
              <td
                colSpan={3}
                className="px-4 py-4 text-center"
                style={{ border: `1px solid ${theme.tableLine}` }}
              >
                <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-black text-white shadow-xs"
                    style={{
                      background: `linear-gradient(180deg, ${theme.badgeBgStart}, ${theme.badgeBgEnd})`,
                    }}
                  >
                    D
                  </span>
                  <span
                    className="text-base sm:text-lg font-extrabold tracking-wide uppercase"
                    style={{ color: theme.inkPrimary }}
                  >
                    Total DEB
                  </span>
                  <strong
                    className="text-xl sm:text-2xl font-black tabular-nums"
                    style={{ color: theme.footAccent }}
                  >
                    {grandDeb}
                  </strong>
                </div>
              </td>
              {dhTotals.map((total, dhIdx) => (
                <td
                  key={`dh-foot-${dhIdx}`}
                  className="px-3 py-3 text-center whitespace-nowrap"
                  style={{ border: `1px solid ${theme.tableLine}` }}
                >
                  <div
                    className="text-[11px] font-extrabold tracking-wider uppercase"
                    style={{ color: theme.inkMuted }}
                  >
                    Total DH
                  </div>
                  <div
                    className="text-lg font-black tabular-nums"
                    style={{ color: theme.footAccent }}
                  >
                    {total > 0 ? formatRupiah(total) : "—"}
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
