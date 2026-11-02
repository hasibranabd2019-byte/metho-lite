CREATE TABLE IF NOT EXISTS admin_order_reads (
  admin_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (admin_id, order_id),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
