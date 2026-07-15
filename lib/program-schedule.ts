import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Sparkles, Star, Telescope } from "lucide-react";

export const PROGRAM_AGE_GROUPS = [
  { label: "5-7 ani", key: "5-7" },
  { label: "7-9 ani", key: "7-9" },
  { label: "9-11 ani", key: "9-11" },
] as const;

export type ProgramAgeGroupKey = (typeof PROGRAM_AGE_GROUPS)[number]["key"];

export type ProgramTimeSlot = {
  interval: string;
  activity: string;
};

export type ProgramDay = {
  title: string;
  key: string;
  icon: LucideIcon;
  schedules: Record<ProgramAgeGroupKey, ProgramTimeSlot[]>;
};

export const PROGRAM_DOWNLOAD_FILE = "/Program-tabere.jpg";
export const PROGRAM_DOWNLOAD_LABEL = "Descarcă programul (JPEG)";

function sharedSchedule(slots: ProgramTimeSlot[]): Record<ProgramAgeGroupKey, ProgramTimeSlot[]> {
  return {
    "5-7": slots,
    "7-9": slots,
    "9-11": slots,
  };
}

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    title: "Ziua 1 — Luni",
    key: "day1",
    icon: Sparkles,
    schedules: sharedSchedule([
      { interval: "08:30 - 09:00", activity: "Sosire copii, warm-up" },
      { interval: "09:00 - 10:15", activity: "Activități de cunoaștere" },
      { interval: "10:15 - 10:30", activity: "Gustare" },
      {
        interval: "10:30 - 12:00",
        activity: "Experimente chimice\nFacultatea de Inginerie Chimică și Biotehnologii",
      },
      {
        interval: "12:00 - 13:00",
        activity: "Plastilină, Bubble station\nTraseu motric, Mud kitchen\nCentru LEGO mic/mare",
      },
      { interval: "13:00 - 14:00", activity: "Prânz" },
      {
        interval: "14:00 - 15:30",
        activity: "Activități susținute de Facultatea de Inginerie Medicală",
      },
      { interval: "15:30 - 15:45", activity: "Gustare și hidratare" },
      { interval: "15:45 - 17:15", activity: "VOLEI Știința București - joc și mișcare" },
      { interval: "17:15 - 17:30", activity: "Activități de relaxare" },
      { interval: "17:30 - 18:00", activity: "Preluare copii" },
    ]),
  },
  {
    title: "Ziua 2 — Marți",
    key: "day2",
    icon: Compass,
    schedules: sharedSchedule([
      { interval: "08:30 - 09:00", activity: "Sosire copii, warm-up" },
      { interval: "09:00 - 10:15", activity: "Activități de cunoaștere" },
      { interval: "10:15 - 10:30", activity: "Gustare" },
      {
        interval: "10:30 - 12:00",
        activity: "Atelier teatru de improvizație în Aula Magna",
      },
      { interval: "12:00 - 13:00", activity: "Fairy Garden" },
      { interval: "13:00 - 14:00", activity: "Prânz" },
      {
        interval: "14:00 - 15:30",
        activity:
          "Laborator microscopie\nLaborator sală anecoică\nActivități lounge facultatea de Inginerie Industrială și Robotică",
      },
      { interval: "15:30 - 15:45", activity: "Gustare și hidratare" },
      { interval: "15:45 - 17:15", activity: "Baschet Știința București - joc și mișcare" },
      { interval: "17:15 - 17:30", activity: "Joacă în echipă, fuga cu sacii" },
      { interval: "17:30 - 18:00", activity: "Preluare copii" },
    ]),
  },
  {
    title: "Ziua 3 — Miercuri",
    key: "day3",
    icon: Star,
    schedules: sharedSchedule([
      { interval: "08:30 - 09:00", activity: "Sosire copii, warm-up" },
      { interval: "09:00 - 10:15", activity: "Activități de cunoaștere" },
      { interval: "10:15 - 10:30", activity: "Gustare" },
      {
        interval: "10:30 - 12:00",
        activity: "Activități susținute de Facultatea de Inginerie Electrică",
      },
      { interval: "12:00 - 13:00", activity: "Activități recreative" },
      { interval: "13:00 - 14:00", activity: "Prânz" },
      {
        interval: "14:00 - 15:30",
        activity: "Activități susținute de Facultatea de Automatică",
      },
      { interval: "15:30 - 15:45", activity: "Gustare și hidratare" },
      { interval: "15:45 - 17:15", activity: "Fotbal Știința București - joc și mișcare" },
      { interval: "17:15 - 17:30", activity: "Table games" },
      { interval: "17:30 - 18:00", activity: "Preluare copii" },
    ]),
  },
  {
    title: "Ziua 4 — Joi",
    key: "day4",
    icon: CalendarDays,
    schedules: sharedSchedule([
      { interval: "08:30 - 09:00", activity: "Sosire copii, warm-up" },
      { interval: "09:00 - 10:15", activity: "Activități de cunoaștere" },
      { interval: "10:15 - 10:30", activity: "Gustare" },
      {
        interval: "10:30 - 12:00",
        activity: "Activități susținute de Facultatea de Inginerie Mecanică și Mecatronică",
      },
      { interval: "12:00 - 13:00", activity: "Autoportret" },
      { interval: "13:00 - 14:00", activity: "Prânz" },
      {
        interval: "14:00 - 15:30",
        activity: "Activități susținute de Facultatea de Inginerie Aerospațială",
      },
      { interval: "15:30 - 15:45", activity: "Gustare și hidratare" },
      { interval: "15:45 - 17:15", activity: "Handbal Știința București - joc și mișcare" },
      { interval: "17:15 - 17:30", activity: "Activități de relaxare" },
      { interval: "17:30 - 18:00", activity: "Preluare copii" },
    ]),
  },
  {
    title: "Ziua 5 — Vineri",
    key: "day5",
    icon: Telescope,
    schedules: sharedSchedule([
      { interval: "08:30 - 09:00", activity: "Sosire copii, warm-up" },
      { interval: "09:00 - 10:15", activity: "Activități de cunoaștere" },
      { interval: "10:15 - 10:30", activity: "Gustare" },
      {
        interval: "10:30 - 12:00",
        activity: "Activități susținute de Facultatea de Ingineria Sistemelor Biotehnice",
      },
      { interval: "12:00 - 13:00", activity: "Gânduri de rămas-bun" },
      { interval: "13:00 - 14:00", activity: "Prânz" },
      { interval: "14:00 - 15:30", activity: "Activități susținute de Euronews România" },
      { interval: "15:30 - 15:45", activity: "Gustare și hidratare" },
      { interval: "15:45 - 17:15", activity: "Absolvire" },
      { interval: "17:15 - 17:30", activity: "Party și poze de final" },
      { interval: "17:30 - 18:00", activity: "Preluare copii" },
    ]),
  },
];
