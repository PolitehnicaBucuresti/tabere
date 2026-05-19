import { z } from "zod";
import { INSCRIPTION_AGE_CATEGORIES, INSCRIPTION_SERIES_OPTIONS } from "./inscription-constants";

export const inscriptionPayloadSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, { message: "Introduceți numele părintelui (minim 2 caractere)." })
    .max(120, { message: "Numele este prea lung." }),
  phone: z.string().trim().min(8, { message: "Introduceți un număr de telefon valid (minim 8 caractere)." }).max(40),
  email: z.string().trim().email({ message: "Introduceți o adresă de e-mail validă." }).max(254),
  childName: z
    .string()
    .trim()
    .min(2, { message: "Introduceți numele copilului (minim 2 caractere)." })
    .max(120),
  age: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const n = typeof val === "number" ? val : Number(val);
      return Number.isFinite(n) ? n : NaN;
    },
    z
      .number({ error: () => "Introduceți vârsta copilului (număr între 5 și 11)." })
      .int({ message: "Vârsta trebuie să fie un număr întreg." })
      .min(5, { message: "Vârsta minimă este 5 ani." })
      .max(11, { message: "Vârsta maximă este 11 ani." }),
  ),
  school: z.string().trim().min(2, { message: "Introduceți școala unde este înscris copilul." }).max(200),
  series: z.enum(INSCRIPTION_SERIES_OPTIONS, { message: "Selectați săptămâna dorită." }),
  medicalInfo: z
    .string()
    .trim()
    .min(1, {
      message:
        "Completați informațiile despre alergii sau afecțiuni (sau scrieți „Nu există” dacă nu este cazul).",
    })
    .max(4000),
  childPassions: z
    .string()
    .trim()
    .min(1, {
      message:
        "Descrieți pasiunile copilului sau scrieți „Nu există” dacă nu este cazul.",
    })
    .max(4000),
  organizerNotes: z
    .string()
    .trim()
    .min(1, {
      message:
        "Completați mesajul pentru organizatori sau scrieți „Nu am informații suplimentare.” dacă nu este cazul.",
    })
    .max(4000),
  gdpr: z.literal(true, { message: "Este necesar consimțământul pentru prelucrarea datelor personale." }),
  ageCategory: z.enum(INSCRIPTION_AGE_CATEGORIES, { message: "Selectați categoria de vârstă (tab)." }),
});

export type InscriptionPayload = z.infer<typeof inscriptionPayloadSchema>;
