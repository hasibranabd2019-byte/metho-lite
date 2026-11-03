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
