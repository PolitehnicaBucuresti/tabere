export const INSCRIPTION_SERIES_OPTIONS = [
  "Săptămâna 1 - 22-26 iunie",
  "Săptămâna 2 - 29 iunie - 3 iulie",
  "Săptămâna 3 - 6-10 iulie",
  "Săptămâna 4 - 13-17 iulie",
] as const;

export type InscriptionSeries = (typeof INSCRIPTION_SERIES_OPTIONS)[number];

export const INSCRIPTION_AGE_CATEGORIES = ["5-7 ani", "7-9 ani", "9-11 ani"] as const;

export type InscriptionAgeCategory = (typeof INSCRIPTION_AGE_CATEGORIES)[number];

/** Locuri confirmate (status „Înscris”) per grupă de vârstă și perioadă. */
export const INSCRIPTION_CONFIRMED_SLOTS_PER_GROUP = 25;

/** Maxim înscrieri acceptate în total (inclusiv listă de așteptare) per grupă / perioadă. */
export const INSCRIPTION_SLOT_CAPACITY_PER_GROUP = 40;

/** Mesaj afișat când combinația grupă + perioadă este completă. */
export const INSCRIPTION_SLOT_FULL_MESSAGE =
  "Ne pare rău, pentru grupa de vârstă și perioada aleasă s-a atins numărul maxim de înscrieri.";

/** Tarif afișat în formular și secțiunea „Program și tarife”. */
export const INSCRIPTION_WEEKLY_PRICE_AMOUNT = "1 100 RON";
export const INSCRIPTION_WEEKLY_PRICE_PERIOD = "/ copil / săptămână";
export const INSCRIPTION_WEEKLY_PRICE_DISPLAY = `${INSCRIPTION_WEEKLY_PRICE_AMOUNT} ${INSCRIPTION_WEEKLY_PRICE_PERIOD}`;
export const INSCRIPTION_SIBLING_DISCOUNT_LABEL = "Discount frați: 20%";
