import {
  INSCRIPTION_PUBLIC_OPEN_SERIES,
  INSCRIPTION_SERIES_OPTIONS,
  isPublicInscriptionSlotOpen,
} from "@/lib/inscription-constants";

/** Matches API GET /api/inscriere/capacity `slots` shape. */
export type SlotCountMap = Record<
  string,
  Record<string, { count: number; remaining: number; full: boolean }>
>;

export function ageCategoryFullyBooked(slots: SlotCountMap, age: string): boolean {
  return INSCRIPTION_SERIES_OPTIONS.every((series) => slots[series]?.[age]?.full === true);
}

export function isSeriesAgeFull(slots: SlotCountMap | null, series: string, age: string): boolean {
  if (!slots) return false;
  return slots[series]?.[age]?.full === true;
}

/** True dacă pentru fiecare combinație legitimă nu mai sunt locuri. */
export function allProgramSlotsFull(slots: SlotCountMap | null): boolean {
  if (!slots) return false;
  return INSCRIPTION_SERIES_OPTIONS.every((series) =>
    slots[series] ? Object.values(slots[series]).every((cell) => cell.full) : true,
  );
}

/** True dacă toate sloturile deschise public (5–7, săpt. 2–4) sunt la capacitate. */
export function allPublicOpenSlotsFull(slots: SlotCountMap | null): boolean {
  if (!slots) return false;
  return INSCRIPTION_PUBLIC_OPEN_SERIES.every((series) =>
    isSeriesAgeFull(slots, series, "5-7 ani"),
  );
}

export function firstAvailablePublicSeries(slots: SlotCountMap | null): (typeof INSCRIPTION_SERIES_OPTIONS)[number] {
  const open = INSCRIPTION_PUBLIC_OPEN_SERIES.find(
    (series) => !isSeriesAgeFull(slots, series, "5-7 ani"),
  );
  return open ?? INSCRIPTION_PUBLIC_OPEN_SERIES[0];
}
