# METHO-LITE WhatsApp Notifications — implementation notes

## Scope
Official Meta WhatsApp Cloud API only. No unofficial WhatsApp Web automation, browser session, QR login, or scraping.

## Existing architecture verified
- Production backend is a Cloudflare Worker with Cloudflare D1 binding `DB`.
- The existing order API writes to D1 and must not wait for WhatsApp API calls.
- Orders are accepted by an admin before courier booking. WhatsApp order confirmation must be enqueued only after the admin accepts an order.
- Steafast tracking is currently refreshed by an authenticated admin action at `POST /api/admin/orders/:id/track`; it is not a continuous webhook feed. A tracking notification can be enqueued only when the saved courier status actually changes.
- Invoice PDF is currently generated in the browser by the existing invoice flow. Before sending it on WhatsApp, a stable server-accessible PDF artifact must be produced and stored securely; do not send a temporary client blob URL.

## Design
1. Add explicit WhatsApp consent to checkout; default unchecked. Persist consent on the order.
2. Normalize Bangladesh numbers to E.164 (+8801XXXXXXXXX) for provider requests; retain the existing local phone format for courier/business logic.
3. Enqueue an idempotent event into `whatsapp_message_queue` from the same business transition that accepts an order or records a changed courier status. Unique(order_id,event_key) prevents duplicate notifications.
4. Process the queue asynchronously with a Cloudflare Worker scheduled trigger (or Cloudflare Queues if provisioned). Never call Meta synchronously from checkout, admin status updates, or courier tracking requests.
5. Use bounded batches, leases, exponential retry with jitter, attempt caps, and stale-processing recovery. Never retry permanent invalid-recipient/template/permission errors indefinitely.
6. Verify Meta webhook signatures (X-Hub-Signature-256) using the app secret; support GET webhook verification and POST delivery-status events. Webhook updates only the message log/queue status.
7. Use approved Utility templates for order confirmation and shipping/delivery updates where required by Meta policy. Do not infer WhatsApp registration by opening a wa.me link; only provider delivery/failure feedback can indicate reachability.
8. Keep tokens/app secrets only in Cloudflare Worker secrets, never in source, D1, public config, or admin-readable settings.
9. Admin UI should show opt-in, queued/sent/delivered/read/failed states and allow retry only for retryable failures. Customer can opt out; honor opt-out on all future sends.

## Message events
- order_accepted: confirmation with order code, line items, payable amount.
- invoice_pdf: PDF document attached to the accepted order (after secure PDF artifact generation/storage is implemented).
- courier_booked: tracking code/link after successful Steadfast booking.
- courier_status:<normalized-status>: send only when status changes; dedupe identical statuses and avoid noisy intermediate repeats.

## Performance and reliability
- D1 queue writes are short local DB operations. The Worker response must not wait for outbound Meta requests.
- Scheduled worker drains a small fixed batch and applies per-run time limits.
- Meta failures must never roll back an order, invoice, or courier update.
- Store provider message IDs and asynchronous webhook status transitions for auditability.

## Rollout gates
- Feature branch only until reviewed and tested.
- Apply schema migration only after staging verification and backup.
- Do not enable live sends until the user has a Meta Business Portfolio, WhatsApp Business Account, registered sender, permanent/system-user token, app secret, webhook verify token, and approved Utility templates (or an explicitly verified eligible Direct Send capability).
- Test with the business's own opted-in number first; then enable gradually.
