export const INSCRIPTION_SERIES_OPTIONS = [
  "Săptămâna 1 - 22-26 iunie",
  "Săptămâna 2 - 29 iunie - 3 iulie",
  "Săptămâna 3 - 6-10 iulie",
  "Săptămâna 4 - 13-17 iulie",
] as const;

export type InscriptionSeries = (typeof INSCRIPTION_SERIES_OPTIONS)[number];

export const INSCRIPTION_AGE_CATEGORIES = ["5-7 ani", "7-9 ani", "9-11 ani"] as const;

export type InscriptionAgeCategory = (typeof INSCRIPTION_AGE_CATEGORIES)[number];

/** Locuri confirmate implicite (status „Înscris”) per grupă de vârstă și perioadă. */
export const INSCRIPTION_CONFIRMED_SLOTS_PER_GROUP = 25;

/** Grupuri cu limită redusă (ex. sesiuni încă necompletate). De la locul N+1 → listă de așteptare. */
export const INSCRIPTION_CONFIRMED_SLOTS_OVERRIDES: Partial<
  Record<InscriptionAgeCategory, number>
> = {
  "5-7 ani": 23,
};

export function getConfirmedSlotsForAgeCategory(ageCategory: string): number {
  return (
    INSCRIPTION_CONFIRMED_SLOTS_OVERRIDES[ageCategory as InscriptionAgeCategory] ??
    INSCRIPTION_CONFIRMED_SLOTS_PER_GROUP
  );
}

/** Maxim înscrieri acceptate în total (inclusiv listă de așteptare) per grupă / perioadă. */
export const INSCRIPTION_SLOT_CAPACITY_PER_GROUP = 40;

/** Mesaj afișat când combinația grupă + perioadă este completă. */
export const INSCRIPTION_SLOT_FULL_MESSAGE =
  "Ne pare rău, pentru grupa de vârstă și perioada aleasă s-a atins numărul maxim de înscrieri.";

/** Singura grupă de vârstă cu înscrieri deschise în formularul public. */
export const INSCRIPTION_PUBLIC_OPEN_AGE_CATEGORY: InscriptionAgeCategory = "5-7 ani";

/** Săptămânile deschise pentru înscriere publică (5–7 ani). */
export const INSCRIPTION_PUBLIC_OPEN_SERIES: readonly InscriptionSeries[] = [
  INSCRIPTION_SERIES_OPTIONS[1],
  INSCRIPTION_SERIES_OPTIONS[2],
  INSCRIPTION_SERIES_OPTIONS[3],
];

export function isPublicInscriptionSlotOpen(ageCategory: string, series: string): boolean {
  if (ageCategory !== INSCRIPTION_PUBLIC_OPEN_AGE_CATEGORY) return false;
  return (INSCRIPTION_PUBLIC_OPEN_SERIES as readonly string[]).includes(series);
}

/** Tarif afișat în formular și secțiunea „Program și tarife”. */
export const INSCRIPTION_WEEKLY_PRICE_AMOUNT = "1 100 RON";
export const INSCRIPTION_WEEKLY_PRICE_PERIOD = "/ copil / săptămână";
export const INSCRIPTION_WEEKLY_PRICE_DISPLAY = `${INSCRIPTION_WEEKLY_PRICE_AMOUNT} ${INSCRIPTION_WEEKLY_PRICE_PERIOD}`;
export const INSCRIPTION_SIBLING_DISCOUNT_LABEL =
  "Discount frați: 20% (pentru al doilea frate, discount aplicabil doar la tarif neredus)";

/** Fișier în `public/` — notă de informare GDPR. */
export const GDPR_INFORMATION_NOTICE_URL = "/nota-informare.pdf";
