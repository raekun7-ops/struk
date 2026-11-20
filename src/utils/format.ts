import type { Customer, Mantri, ReportState } from "../types/report";

export function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatRupiah(value: number): string {
  if (!value) return "0";
  return new Intl.NumberFormat("id-ID").format(value);
}

export function parseNumber(value: string | number): number {
  const num = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

export function getIndonesianDate(): string {
  const now = new Date();
  return now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar",
  });
}

export function getCustomerLoanValue(customer: Customer, loan: string): number {
  return Number(customer.loans?.[loan] || 0);
}

export function getLoanTotal(mantri: Mantri, loan: string): number {
  return mantri.customers.reduce(
    (sum, customer) => sum + getCustomerLoanValue(customer, loan),
    0
  );
}

export function getLoanDeb(mantri: Mantri, loan: string): number {
  return mantri.customers.filter(
    (customer) => customer.name.trim() && getCustomerLoanValue(customer, loan) > 0
  ).length;
}

export function getMantriTotal(mantri: Mantri, loans: string[]): number {
  return loans.reduce((sum, loan) => sum + getLoanTotal(mantri, loan), 0);
}

export function getMantriDeb(mantri: Mantri, loans: string[]): number {
  return loans.reduce((sum, loan) => sum + getLoanDeb(mantri, loan), 0);
}

export function normalizeState(
  raw: Partial<ReportState> | null | undefined,
  starterData: ReportState
): ReportState {
  const next = cloneState(raw || starterData) as ReportState;
  next.title = next.title || starterData.title;
  next.loans =
    Array.isArray(next.loans) && next.loans.length ? [...next.loans] : ["KUR"];
  next.mantri = Array.isArray(next.mantri) ? next.mantri : [];
  next.dhColumns = Array.isArray(next.dhColumns) ? next.dhColumns : [];

  next.mantri.forEach((mantri) => {
    mantri.customers = Array.isArray(mantri.customers) ? mantri.customers : [];
    mantri.customers.forEach((customer: Customer & { kur?: number }) => {
      customer.loans = customer.loans || {};
      if (customer.kur && !customer.loans.KUR) {
        customer.loans.KUR = Number(customer.kur || 0);
      }
      next.loans.forEach((loan) => {
        customer.loans[loan] = Number(customer.loans[loan] || 0);
      });
      delete customer.kur;
    });

    if (!Array.isArray(mantri.dhValues)) mantri.dhValues = [];
    while (mantri.dhValues.length < (next.dhColumns?.length || 0)) {
      mantri.dhValues.push("");
    }
    mantri.dhValues.length = next.dhColumns?.length || 0;
  });

  return next;
}
