export interface Customer {
  name: string;
  loans: Record<string, number>;
  empty?: boolean;
}

export interface Mantri {
  name: string;
  customers: Customer[];
  amkkmOverride?: number;
  brinsOverride?: number;
  dhValues?: string[];
}

export interface ReportState {
  title: string;
  loans: string[];
  mantri: Mantri[];
  dhColumns?: string[];
}

export interface UnitConfig {
  storageKey: string;
  oldStorageKey: string | null;
  starterData: ReportState;
}

export interface UnitListItem {
  key: UnitKey;
  label: string;
}

export type UnitKey =
  | "margasari"
  | "tambarangan"
  | "pulau_pinang"
  | "binuang"
  | "ranbar"
  | "rantim";

export interface UnitSettings {
  amkkm: number;
  brins: number;
}

export type CharacterThemeId = "spongebob" | "woody" | "pikachu" | "doraemon";

export interface CharacterThemeConfig {
  id: CharacterThemeId;
  name: string;
  subtitle: string;
  frameBorder: string;
  bannerBgStart: string;
  bannerBgEnd: string;
  bannerDotColor: string;
  titleFillTop: string;
  titleFillBottom: string;
  titleStroke: string;
  titleShadow: string;
  dateBorder: string;
  dateText: string;
  tableHeadStart: string;
  tableHeadEnd: string;
  tableHeadText: string;
  tableLine: string;
  rowAltBg: string;
  badgeBgStart: string;
  badgeBgEnd: string;
  inkPrimary: string;
  inkMuted: string;
  footBgStart: string;
  footBgEnd: string;
  footAccent: string;
  characterPngUrl: string;
  backgroundPngUrl: string;
  characterSvg: string;
  avatarSvg: string;
}

export interface CustomThemeAssets {
  characterDataUrl?: string;
  backgroundDataUrl?: string;
}
