-- Opaque invoice download links. Only token hashes are stored; PDFs are generated on demand in the browser.
CREATE TABLE IF NOT EXISTS invoice_download_tokens (
  token_hash TEXT PRIMARY KEY,
  order_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_invoice_download_tokens_order_expiry ON invoice_download_tokens(order_id, expires_at);
