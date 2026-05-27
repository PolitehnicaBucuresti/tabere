import { prisma } from "@/lib/prisma";
import type { InscriptionPayload } from "@/lib/inscription-schema";
import {
  INSCRIPTION_AGE_CATEGORIES,
  INSCRIPTION_SERIES_OPTIONS,
  INSCRIPTION_SLOT_CAPACITY_PER_GROUP,
} from "@/lib/inscription-constants";
import type { SlotCountMap } from "@/lib/inscription-slot-helpers";

export type { SlotCountMap } from "@/lib/inscription-slot-helpers";

/** Build nested map matching known series × age categories; unknown DB keys are ignored client-side keys. */
export async function computeInscriptionSlots(): Promise<{
  limit: number;
  slots: SlotCountMap;
}> {
  const grouped = await prisma.application.groupBy({
    by: ["series", "ageCategory"],
    _count: { _all: true },
  });

  const raw = new Map<string, Map<string, number>>();
  for (const row of grouped) {
    let inner = raw.get(row.series);
    if (!inner) {
      inner = new Map();
      raw.set(row.series, inner);
    }
    inner.set(row.ageCategory, row._count._all);
  }

  const limit = INSCRIPTION_SLOT_CAPACITY_PER_GROUP;
  const slots: SlotCountMap = {};

  for (const series of INSCRIPTION_SERIES_OPTIONS) {
    slots[series] = {};
    const inner = raw.get(series);
    for (const age of INSCRIPTION_AGE_CATEGORIES) {
      const count = inner?.get(age) ?? 0;
      const remaining = Math.max(0, limit - count);
      slots[series][age] = { count, remaining, full: remaining === 0 };
    }
  }

  return { limit, slots };
}

const MAX_SERIALIZABLE_RETRIES = 8;
/**
 * Serialize-safe create: prevents overbooking when many parents submit together.
 */
export async function createApplicationIfSlotAvailable(
  d: InscriptionPayload,
): Promise<{ ok: true; applicationId: string } | { ok: false; code: "SLOT_FULL" }> {
  for (let attempt = 0; attempt < MAX_SERIALIZABLE_RETRIES; attempt++) {
    try {
      const row = await prisma.$transaction(
        async (tx) => {
          const cnt = await tx.application.count({
            where: {
              series: d.series,
              ageCategory: d.ageCategory,
            },
          });

          if (cnt >= INSCRIPTION_SLOT_CAPACITY_PER_GROUP) {
            return null;
          }

          return tx.application.create({
            data: {
              parentName: d.parentName,
              phone: d.phone,
              email: d.email,
              childName: d.childName,
              age: d.age,
              school: d.school,
              series: d.series,
              ageCategory: d.ageCategory,
              medicalInfo: d.medicalInfo,
              childPassions: d.childPassions,
              organizerNotes: d.organizerNotes,
              discountCode: d.discountCode,
              gdprAccepted: true,
            },
          });
        },
        { isolationLevel: "Serializable", maxWait: 5000, timeout: 12000 },
      );

      if (row === null) {
        return { ok: false, code: "SLOT_FULL" };
      }

      return { ok: true, applicationId: row.id };
    } catch (e: unknown) {
      const tagged = e as { code?: string };
      if (tagged?.code === "P2034") {
        await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }

  return { ok: false, code: "SLOT_FULL" };
}
