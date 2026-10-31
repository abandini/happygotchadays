-- Gotcha day reminder emails.
--
-- reminder_sends: delivery ledger, one row per (pet, anniversary year, kind),
-- kind 'week_before' or 'day_of'. A row is inserted 'pending' (the claim) with
-- the exact Resend request body in `payload` BEFORE Resend is called.
--   2xx                    -> 'sent'
--   409                    -> 'gave_up'
--   other 4xx (incl. 429)  -> row deleted only if attempts = 1 AND ambiguous = 0;
--                             otherwise 'gave_up'
--   network error / 5xx    -> ambiguous = 1, stays 'pending'; retried with the
--                             stored payload and same Idempotency-Key after 15
--                             minutes, max 3 attempts, within 23h of claimed_at
-- attempts and claimed_at are never reset. Rows in any status are never re-claimed.
CREATE TABLE IF NOT EXISTS reminder_sends (
    pet_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('week_before', 'day_of')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'gave_up')),
    attempts INTEGER NOT NULL DEFAULT 1,
    ambiguous INTEGER NOT NULL DEFAULT 0, -- 1 once any attempt hit a 5xx/network error (or was re-claimed stale)
    payload TEXT NOT NULL,                -- exact JSON body sent to Resend; retries resend it unchanged
    claimed_at INTEGER NOT NULL,          -- unix seconds of the first claim
    updated_at INTEGER NOT NULL,          -- unix seconds of the last claim/attempt/status change
    PRIMARY KEY (pet_id, year, kind)
);

-- Reminder email opt-out, set by POST /unsubscribe. Not idempotent: run once.
ALTER TABLE users ADD COLUMN reminder_emails_off INTEGER NOT NULL DEFAULT 0;
