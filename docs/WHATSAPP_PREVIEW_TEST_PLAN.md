# METHO Lite WhatsApp Preview Test Plan

Scope: `feature/whatsapp-safe-number-test` only. Never merge or deploy this branch to Production as part of preview testing.

## Preview resources
- Pages project: `metho-lite`
- Preview D1: `8a628078-60b3-4061-ac11-c40b7a9029e7`
- Production branch remains `main`.

## Safety gates
- Preview database backup exported before schema changes.
- Migrations 0006 and 0007 applied only to Preview D1.
- Never send a message until an administrator explicitly enters and confirms their own WhatsApp number and has opted in.
- Never use customer numbers for test sends.
- Keep Meta token, App Secret, and webhook verify token in Cloudflare secrets only.
- Do not merge, deploy Production, or apply Production migrations without explicit approval.

## Required Preview variables
- Secret: `WHATSAPP_ACCESS_TOKEN`
- Secret: `WHATSAPP_APP_SECRET`
- Secret: `WHATSAPP_PHONE_NUMBER_ID`
- Secret: `WHATSAPP_VERIFY_TOKEN`
- Plain text: `WHATSAPP_GRAPH_VERSION=v26.0`
- Plain text: `WHATSAPP_ORDER_TEMPLATE=metho_order_accepted_bn`
- Plain text: `WHATSAPP_TRACKING_TEMPLATE=metho_courier_update_bn`
- Plain text: `WHATSAPP_TEMPLATE_LANGUAGE=bn`

## Test checklist
1. Confirm Preview health and admin login.
2. Confirm checkout opt-in is optional and unchecked by default.
3. Create a clearly labelled test order with the admin's own WhatsApp number.
4. Admin accepts the test order; verify exactly one outbox item is created.
5. Verify Meta message ID and webhook receipts (sent/delivered/read/failed).
6. Verify invoice link and 90-day expiry.
7. Verify courier update only when status changes.
8. Verify retries and duplicate prevention.
9. Confirm no effect on Production site/database.
