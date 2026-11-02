-- METHO Lite site customization, visitor analytics, location and courier metadata.
ALTER TABLE orders ADD COLUMN latitude REAL;
ALTER TABLE orders ADD COLUMN longitude REAL;
ALTER TABLE orders ADD COLUMN courier_status TEXT;
ALTER TABLE orders ADD COLUMN courier_consignment_id TEXT;
ALTER TABLE orders ADD COLUMN courier_tracking_code TEXT;
ALTER TABLE orders ADD COLUMN courier_disabled INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS hero_banners (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT NOT NULL, alt_text TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS site_visitors (visitor_id TEXT NOT NULL, visit_date TEXT NOT NULL, last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(visitor_id, visit_date));
CREATE INDEX IF NOT EXISTS idx_site_visitors_date ON site_visitors(visit_date);
CREATE TABLE IF NOT EXISTS order_sequences (date_key TEXT PRIMARY KEY, last_seq INTEGER NOT NULL DEFAULT 0);
