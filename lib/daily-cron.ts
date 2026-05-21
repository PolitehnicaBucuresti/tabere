import { schedule } from "node-cron";
import { runDailyDigestJob } from "@/lib/daily-digest";

let registered = false;

/**
 * Schedules daily digest email at 09:00 Europe/Bucharest.
 * Guarded to run once per Node process.
 */
export function scheduleDailyCron(): void {
  if (registered) return;
  registered = true;

  schedule(
    "0 9 * * *",
    async () => {
      console.log("[cron] Daily digest job started (09:00 Europe/Bucharest).");
      const result = await runDailyDigestJob();
      if (!result.ok) {
        console.error("[cron] Daily digest failed:", result.error);
      }
    },
    { timezone: "Europe/Bucharest" },
  );

  console.log("[cron] Registered: daily digest at 09:00 (Europe/Bucharest).");
}
