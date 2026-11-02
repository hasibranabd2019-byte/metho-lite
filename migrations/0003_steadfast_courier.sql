-- Steadfast courier response metadata for METHO Lite.
ALTER TABLE orders ADD COLUMN courier_response TEXT;
ALTER TABLE orders ADD COLUMN courier_updated_at TEXT;
