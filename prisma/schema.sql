-- Project Database Schema Migration (Postgres)
-- Table for storing incoming SMS messages from Android forwarding apps

CREATE TABLE IF NOT EXISTS "InboundSms" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "received_at" TIMESTAMPTZ,
    "raw_payload" JSONB,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS "idx_inbound_sms_sender" ON "InboundSms"("sender");
CREATE INDEX IF NOT EXISTS "idx_inbound_sms_created_at" ON "InboundSms"("created_at" DESC);
