-- Status: primele 25 = înscris, de la 26 = listă de așteptare (capacitate totală rămâne 40)
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
SET "waitlisted" = (r.rn > 25)
FROM ranked AS r
WHERE a.id = r.id;
