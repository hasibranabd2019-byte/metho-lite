CREATE TABLE customer_lookup_limits (
 key TEXT PRIMARY KEY,
 window_started_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_customer_lookup_limits_window ON customer_lookup_limits(window_started_at);
