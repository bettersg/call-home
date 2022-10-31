-- Analysis for May
WITH fb_users AS (
  SELECT "userId", "DormValidations"."createdAt"
    FROM "DormValidations"
)
SELECT * from joined_calls
 WHERE EXISTS (SELECT "userId" FROM fb_users WHERE fb_users."userId"="joined_calls"."userId")
 AND "status"='completed'
  AND "createdAt" BETWEEN '2021-05-01' AND '2021-06-01';

