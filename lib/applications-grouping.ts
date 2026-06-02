import type { Application } from "@prisma/client";
import {
  INSCRIPTION_AGE_CATEGORIES,
  INSCRIPTION_SERIES_OPTIONS,
} from "@/lib/inscription-constants";

export type ApplicationSlotGroup = {
  ageCategory: string;
  series: string;
  applications: Application[];
};

function slotKey(ageCategory: string, series: string): string {
  return `${ageCategory}\0${series}`;
}

/** API JSON trimite `createdAt` ca string; Prisma pe server ca Date. */
function createdAtMs(createdAt: Date | string): number {
  const t = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  return Number.isFinite(t) ? t : 0;
}

/** Grupează înscrierile în ordinea canonică: grupă de vârstă × perioadă. */
export function groupApplicationsBySlot(apps: Application[]): ApplicationSlotGroup[] {
  const byKey = new Map<string, Application[]>();

  for (const app of apps) {
    const key = slotKey(app.ageCategory, app.series);
    const list = byKey.get(key);
    if (list) list.push(app);
    else byKey.set(key, [app]);
  }

  for (const list of byKey.values()) {
    list.sort((a, b) => createdAtMs(b.createdAt) - createdAtMs(a.createdAt));
  }

  const groups: ApplicationSlotGroup[] = [];
  const seen = new Set<string>();

  for (const ageCategory of INSCRIPTION_AGE_CATEGORIES) {
    for (const series of INSCRIPTION_SERIES_OPTIONS) {
      const key = slotKey(ageCategory, series);
      seen.add(key);
      groups.push({
        ageCategory,
        series,
        applications: byKey.get(key) ?? [],
      });
    }
  }

  for (const [key, applications] of byKey) {
    if (seen.has(key)) continue;
    const [ageCategory, series] = key.split("\0");
    groups.push({ ageCategory, series, applications });
  }

  return groups;
}
