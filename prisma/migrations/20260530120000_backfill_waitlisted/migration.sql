-- Retroactiv: primele 40 înscrieri / grupă + perioadă = confirmate, restul = listă de așteptare
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "ageCategory", "series"
      ORDER BY "createdAt" ASC
    ) AS rn
  FROM "Application"
)
UPDATE "Application" AS a
SET "waitlisted" = (r.rn > 40)
FROM ranked AS r
WHERE a.id = r.id;
