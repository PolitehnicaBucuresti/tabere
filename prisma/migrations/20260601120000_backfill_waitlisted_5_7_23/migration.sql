-- 5–7 ani: primele 23 = înscris, 24+ = listă așteptare; alte grupe: primele 25
WITH ranked AS (
  SELECT
    id,
    "ageCategory",
    ROW_NUMBER() OVER (
      PARTITION BY "ageCategory", "series"
      ORDER BY "createdAt" ASC
    ) AS rn
  FROM "Application"
)
UPDATE "Application" AS a
SET "waitlisted" = (
  CASE
    WHEN r."ageCategory" = '5-7 ani' THEN r.rn > 23
    ELSE r.rn > 25
  END
)
FROM ranked AS r
WHERE a.id = r.id;
