-- WhatsApp opt-in and asynchronous outbox. Apply only after taking a D1 backup.
ALTER TABLE orders ADD COLUMN whatsapp_opt_in INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS whatsapp_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  event_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient_e164 TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','processing','sent','delivered','read','failed','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lease_until TEXT,
  provider_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(order_id, event_key),
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_due
  ON whatsapp_outbox(status, available_at, lease_until);

CREATE TABLE IF NOT EXISTS whatsapp_webhook_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_event_id TEXT NOT NULL UNIQUE,
  provider_message_id TEXT,
  recipient_e164 TEXT,
  event_status TEXT NOT NULL,
  event_timestamp TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_message
  ON whatsapp_webhook_events(provider_message_id);
