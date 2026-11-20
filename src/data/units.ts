import type { UnitConfig, UnitKey, UnitListItem } from "../types/report";

export const LOAN_OPTIONS = [
  "KUR",
  "CASHCOL",
  "KPP",
  "KUPEDES",
  "KUPERA",
  "BRIGUNA",
  "UMI",
] as const;

export const MANTRI_PN: Record<string, string> = {
  // Margasari
  "IHSAN": "00408410",
  "ARUL": "00132854",
  "RAJAB": "00285597",
  // Pulau Pinang
  "MUHAMMADAN": "00088992",
  "RUDDY KURNIAWAN": "00223278",
  "HADRIYANI": "00168549",
  "AL HASANI": "00398271",
  // Rantau Barat
  "M HENDRA WAHYUDI": "00282615",
  "RADINA": "00407671",
  "NETTY SETIAWATI": "00324770",
  "M FIRMAN MAULANI": "00350384",
  // Binuang
  "AKMAL FIRDAUS": "00305893",
  "AULIA": "00296609",
  "M SYAMSU RIZAL": "00363597",
  "RUDI HARTONO": "00282614",
  "ACHMAD RIZKYANNOOR": "00189669",
  "DANIAL BASRI": "00409818",
  // Rantau Timur
  "HENDRA WAHYUDI": "00297286",
  "SHALEH ANSHARI": "00232664",
  "IWAN SETIAWAN": "00121578",
  "MUHAMMAD REZA AZHARI": "00378280",
  "RIKA WIDIANINGSIH": "00373749",
  "RAEHAN FADILA": "00406684",
  // Tambarangan
  "WAHYU": "00249457",
  "DEDE ARIANDANA": "00249474",
  "HELENA SAPITRI": "00223274",
  "AHMAD": "00345045",
  "RIMA MAULIDA": "00399285",
};

export function getMantriPN(name: string): string {
  if (!name) return "";
  return MANTRI_PN[name.trim().toUpperCase()] || "";
}

export const UNIT_LIST: UnitListItem[] = [
  { key: "margasari", label: "MARGASARI" },
  { key: "tambarangan", label: "TAMBARANGAN" },
  { key: "pulau_pinang", label: "PULAU PINANG" },
  { key: "binuang", label: "BINUANG" },
  { key: "ranbar", label: "RANBAR" },
  { key: "rantim", label: "RANTIM" },
];

export const UNITS: Record<UnitKey, UnitConfig> = {
  margasari: {
    storageKey: "margasari-report-v2",
    oldStorageKey: "margasari-report-v1",
    starterData: {
      title: "MARGASARI",
      loans: ["KUR"],
      mantri: [
        { name: "IHSAN", customers: [] },
        { name: "ARUL", customers: [] },
        { name: "RAJAB", customers: [] },
      ],
    },
  },
  tambarangan: {
    storageKey: "tambarangan-report-v2",
    oldStorageKey: null,
    starterData: {
      title: "TAMBARANGAN",
      loans: ["KUR"],
      mantri: [
        { name: "WAHYU", customers: [] },
        { name: "AHMAD", customers: [] },
        { name: "HELENA SAPITRI", customers: [] },
        { name: "DEDE ARIANDANA", customers: [] },
        { name: "RIMA MAULIDA", customers: [] },
      ],
    },
  },
  pulau_pinang: {
    storageKey: "pulau-pinang-report-v2",
    oldStorageKey: null,
    starterData: {
      title: "PULAU PINANG",
      loans: ["KUR"],
      mantri: [
        { name: "HADRIYANI", customers: [] },
        { name: "MUHAMMADAN", customers: [] },
        { name: "AL HASANI", customers: [] },
        { name: "RUDDY KURNIAWAN", customers: [] },
      ],
    },
  },
  binuang: {
    storageKey: "binuang-report-v2",
    oldStorageKey: null,
    starterData: {
      title: "BINUANG",
      loans: ["KUR"],
      mantri: [
        { name: "AKMAL FIRDAUS", customers: [] },
        { name: "AULIA", customers: [] },
        { name: "M SYAMSU RIZAL", customers: [] },
        { name: "RUDI HARTONO", customers: [] },
        { name: "ACHMAD RIZKYANNOOR", customers: [] },
        { name: "DANIAL BASRI", customers: [] },
      ],
    },
  },
  ranbar: {
    storageKey: "ranbar-report-v2",
    oldStorageKey: null,
    starterData: {
      title: "RANTAU BARAT",
      loans: ["KUR"],
      mantri: [
        { name: "M HENDRA WAHYUDI", customers: [] },
        { name: "RADINA", customers: [] },
        { name: "NETTY SETIAWATI", customers: [] },
        { name: "M FIRMAN MAULANI", customers: [] },
      ],
    },
  },
  rantim: {
    storageKey: "rantim-report-v2",
    oldStorageKey: null,
    starterData: {
      title: "RANTAU TIMUR",
      loans: ["KUR"],
      mantri: [
        { name: "HENDRA WAHYUDI", customers: [] },
        { name: "SHALEH ANSHARI", customers: [] },
        { name: "IWAN SETIAWAN", customers: [] },
        { name: "MUHAMMAD REZA AZHARI", customers: [] },
        { name: "RIKA WIDIANINGSIH", customers: [] },
        { name: "RAEHAN FADILA", customers: [] },
      ],
    },
  },
};

export const ADMIN_PASSWORD = "WALUH";
export const UNIT_PASSWORDS_KEY = "unit-passwords-v1";
export const UNIT_SETTINGS_KEY = "unit-amkkm-brins-settings-v1";
export const DEFAULT_UNIT_SETTINGS = { amkkm: 0, brins: 0 };
