export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (process.env.DISABLE_DAILY_CRON === "1") {
    console.log("[instrumentation] Daily cron disabled (DISABLE_DAILY_CRON=1).");
    return;
  }

  const { scheduleDailyCron } = await import("@/lib/daily-cron");
  scheduleDailyCron();
}
