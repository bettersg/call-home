CREATE MATERIALIZED VIEW call_attempts_joined
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
