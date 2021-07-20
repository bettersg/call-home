CREATE MATERIALIZED VIEW if NOT EXISTS joined_calls
AS
  SELECT
  "Calls"."createdAt",
  "contactId",
  "duration",
  "price",
  "priceUnit",
  "status",
  "toPhoneNumber",
  "twilioSid",
  "userId"
  FROM
  "Calls" FULL OUTER JOIN "TwilioCalls"
  ON
  "Calls"."incomingTwilioCallSid"="TwilioCalls"."parentCallSid";

REFRESH MATERIALIZED VIEW joined_calls;
