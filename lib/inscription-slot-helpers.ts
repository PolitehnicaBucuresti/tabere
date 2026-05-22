import { INSCRIPTION_SERIES_OPTIONS } from "@/lib/inscription-constants";

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
