# METHO-LITE WhatsApp Notifications

Official Meta WhatsApp Cloud API only. All sends remain asynchronous and isolated from checkout, admin updates, and courier tracking.

## Design and safeguards
- Checkout WhatsApp consent is optional and unchecked by default.
- Admin acceptance is required before an opted-in order confirmation is queued.
- Phone numbers are normalized to E.164 for Meta; local phone format remains unchanged for business logic.
- D1 outbox uses unique `(order_id,event_key)` idempotency, bounded scheduled batches, leases, exponential retry, attempt caps, and stale-job recovery.
- Webhook GET verification and POST HMAC-SHA256 signature verification persist sent/delivered/read/failed receipts.
- Courier notifications are queued only after a saved tracking status changes.
- Keep credentials only in Cloudflare Worker secrets.

## Invoice link workflow
- The order-confirmation Utility template includes a URL button labelled **ইনভয়েস ডাউনলোড**.
- Configure the button URL as `https://metho-lite.pages.dev/invoice-download.html?token={{1}}`; the variable is the final URL component.
- A cryptographically random opaque token is generated when an opted-in order is accepted. Only its SHA-256 hash and order association are stored in D1; the token is retained in the internal outbox payload for delivery/retry.
- Links expire after 90 days. The URL contains no order number, phone, name, or other customer information.
- On click, the Worker validates the token and returns invoice data with no-store caching. The existing branded browser renderer creates and downloads the PDF.
- No PDF file is uploaded, stored, or sent as a WhatsApp attachment. No R2 bucket or invoice-storage binding is needed.
- Existing order-number + phone invoice lookup remains available.

## WhatsApp templates
- Order confirmation body parameters: customer name, order code, payable amount; plus one dynamic URL-button suffix parameter.
- Tracking template body parameters: customer name, order code, courier status.
- Templates must be approved by Meta before live sends.

## Meta template drafts (copy-ready)

Create these templates in WhatsApp Manager and submit them for Meta approval. Keep the language set to Bengali.

### 1) Order accepted
- Suggested template name: `metho_order_accepted_bn`
- Category to request: Utility
- Language: Bengali
- Header: None
- Body (three variables, in this exact order):

  `আসসালামু আলাইকুম {{1}}। আপনার মেঠো অর্ডার {{2}} গ্রহণ করা হয়েছে। মোট পরিশোধযোগ্য {{3}}। ইনভয়েসের কপি পেতে নিচের বোতামে চাপ দিন।`

- URL button label: `ইনভয়েস ডাউনলোড`
- Button URL: `https://metho-lite.pages.dev/invoice-download.html?token={{1}}`
- Button dynamic variable: token suffix supplied by the Worker. Do not add a second token variable to the body.
- Sample values for review: `রহিম`, `MTH-10001`, `৳১,২৫০.০০`; button sample suffix: `AbCdEf0123456789AbCdEf0123456789AbCdEf0123456789`.

### 2) Courier tracking update
- Suggested template name: `metho_courier_update_bn`
- Category to request: Utility
- Language: Bengali
- Header: None
- Body (three variables, in this exact order):

  `আসসালামু আলাইকুম {{1}}। আপনার মেঠো অর্ডার {{2}}-এর কুরিয়ার আপডেট: {{3}}।`

- No buttons.
- Sample values for review: `রহিম`, `MTH-10001`, `কুরিয়ারে পাঠানো হয়েছে`.

The Worker secrets `WHATSAPP_ORDER_TEMPLATE` and `WHATSAPP_TRACKING_TEMPLATE` must contain the exact approved template names. If Meta changes the requested category or rejects wording, use the approved version and update the Worker secret/configuration accordingly.

## Required Worker secrets
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_GRAPH_VERSION`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ORDER_TEMPLATE`
- `WHATSAPP_TRACKING_TEMPLATE`
- Optional `WHATSAPP_TEMPLATE_LANGUAGE` (defaults to `bn`)

## Rollout gates
- Keep changes on `feature/whatsapp-notifications` until reviewed and tested.
- Back up D1 before applying schema changes.
- Do not enable live sends until Meta Business Portfolio, WABA, registered sender, system-user token, app secret, webhook verify token, and approved Utility templates are configured.
- Test with the business's own opted-in number before gradual rollout.
- Apply `migrations/0007_invoice_download_tokens.sql` only after review and a D1 backup.
