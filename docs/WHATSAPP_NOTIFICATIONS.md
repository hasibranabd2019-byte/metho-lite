# METHO-LITE WhatsApp Notifications

Official Meta WhatsApp Cloud API only. Keep all sends asynchronous and isolated from checkout, admin updates, and courier tracking.

## Current integration facts
- Backend: Cloudflare Worker + D1 (`DB`).
- Admin must accept an order before an order-confirmation event is queued.
- Steadfast tracking is refreshed through an authenticated admin action; notify only when the stored status changes.
- Invoice PDF is currently generated in the browser. Before WhatsApp document delivery, create and securely store a stable server-accessible PDF artifact.

## Design
- Add explicit unchecked-by-default WhatsApp consent at checkout.
- Normalize recipient numbers to E.164 for Meta; preserve local phone format for existing business logic.
- Use a D1 outbox table with unique `(order_id,event_key)` idempotency.
- Drain a bounded batch asynchronously via a scheduled Worker. Never wait for Meta from a customer or admin request.
- Use leases, retry backoff, attempt caps, and stale-job recovery.
- Verify webhook signatures with the Meta app secret; persist sent/delivered/read/failed status events.
- Store tokens and app secrets only as Cloudflare Worker secrets.
- Honor opt-out and expose per-order delivery status in Admin Panel.

## Events
- `order_accepted`: order summary and payable amount.
- `invoice_pdf`: PDF document after secure PDF storage is implemented.
- `courier_booked`: tracking number/link after successful Steadfast booking.
- `courier_status:<status>`: only for actual status changes, deduplicated.

## Rollout gates
- Keep changes on `feature/whatsapp-notifications` until reviewed and tested.
- Back up D1 before applying schema changes.
- Do not enable live sends until the Meta Business Portfolio, WABA, registered sender, system-user token, app secret, webhook verify token, and required Utility templates are configured.
- Test with the business's own opted-in number before gradual rollout.

## Implemented on the feature branch
- Checkout consent is optional and unchecked by default; the API stores it on the order.
- Accepting an opted-in order enqueues an idempotent order confirmation.
- Scheduled Worker drains a bounded batch, uses leases, exponential retry, and recovers expired leases.
- Separate configured templates are used for order confirmation and courier status.
- Courier tracking refresh enqueues only when the saved status actually changes.
- Webhook GET verification and POST HMAC-SHA256 signature verification are implemented; sent/delivered/read/failed receipts are persisted.
- Admin order view includes outbox state and retry for failed messages.

## Required Worker secrets
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_GRAPH_VERSION` (for example, the currently supported Graph API version)
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN` (a long random value)
- `WHATSAPP_ORDER_TEMPLATE`
- `WHATSAPP_TRACKING_TEMPLATE`
- `WHATSAPP_INVOICE_TEMPLATE` (approved Utility template with a DOCUMENT header and one body parameter: order code)
- Optional `WHATSAPP_TEMPLATE_LANGUAGE` (defaults to `bn`)

Template body parameters currently expected:
- Order template: customer name, order code, total taka amount.
- Tracking template: customer name, order code, courier status.

## Invoice PDF workflow
- Admin Orders > WhatsApp Notifications shows an **ইনভয়েস পাঠান** action for an accepted-order confirmation that has no invoice event yet.
- The admin action reuses the existing branded invoice renderer, posts the PDF bytes to an authenticated Worker endpoint, validates the PDF signature and 5 MB limit, and stores the object in a private R2 bucket (`metho-invoices-private`).
- The Worker queues a separate idempotent `invoice_pdf` event. The scheduled sender reads the private R2 object, uploads it to Meta `/media`, then sends an approved document-header template using the returned media ID. No public invoice URL is exposed.
- Create the private R2 bucket named `metho-invoices-private` in the same Cloudflare account before deploying this branch; the `METHO_INVOICES` binding is declared in `wrangler.toml`.

## Remaining rollout work The existing browser-only PDF cannot be attached from the Worker.
- Add a secure admin workflow for template preview/test and queue inspection as needed.
- Test with a Meta test number, validate approved template names/language/parameter count, and verify webhook status transitions.
- Add/confirm checkout consent copy and privacy policy wording.
- Run the D1 migration only after a production backup and explicit rollout approval. Do not deploy the scheduled sender until secrets and approved templates are present.
