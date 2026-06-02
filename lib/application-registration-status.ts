import type { Application } from "@prisma/client";
import { INSCRIPTION_SLOT_CAPACITY_PER_GROUP } from "@/lib/inscription-constants";

export const REGISTRATION_STATUS_CONFIRMED = "Înscris";
export const REGISTRATION_STATUS_WAITLIST = "Listă de așteptare";

function createdAtMs(createdAt: Date | string): number {
  const t = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function registrationStatusLabel(waitlisted: boolean): string {
  return waitlisted ? REGISTRATION_STATUS_WAITLIST : REGISTRATION_STATUS_CONFIRMED;
}

/** Poziția 1 = prima înscriere cronologic în slot; peste limită = listă de așteptare. */
export function isWaitlistedBySlotRank(rankOneBased: number): boolean {
  return rankOneBased > INSCRIPTION_SLOT_CAPACITY_PER_GROUP;
}

/**
 * Rang cronologic (1-based) per combinație grupă + perioadă, pentru toate înscrierile din listă.
 */
export function buildRegistrationRankByApplicationId(apps: Application[]): Map<string, number> {
  const bySlot = new Map<string, Application[]>();

  for (const app of apps) {
    const key = `${app.ageCategory}\0${app.series}`;
    const list = bySlot.get(key);
    if (list) list.push(app);
    else bySlot.set(key, [app]);
  }

  const rankById = new Map<string, number>();
  for (const list of bySlot.values()) {
    list.sort((a, b) => createdAtMs(a.createdAt) - createdAtMs(b.createdAt));
    list.forEach((app, index) => {
      rankById.set(app.id, index + 1);
    });
  }

  return rankById;
}

/** Status afișat: după poziția în slot (retroactiv); fallback pe coloana `waitlisted`. */
export function resolveRegistrationStatus(
  app: Application,
  rankById: Map<string, number>,
): string {
  const rank = rankById.get(app.id);
  if (rank !== undefined) {
    return registrationStatusLabel(isWaitlistedBySlotRank(rank));
  }
  return registrationStatusLabel(app.waitlisted);
}

export function isApplicationWaitlisted(
  app: Application,
  rankById: Map<string, number>,
): boolean {
  return resolveRegistrationStatus(app, rankById) === REGISTRATION_STATUS_WAITLIST;
}
