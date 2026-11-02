# METHO Lite

A separate, lightweight, mobile-first Bengali storefront for the METHO brand. The existing METHO production website is a different Cloudflare Pages project and is not modified by this repository.

## Included
- Bengali storefront for jhola and patali date-palm jaggery, with 1 kg and 2 kg variants.
- COD and advance-payment order selection.
- Two-admin first-run setup, login, order review, accept/reject, and status updates.
- Variant price and stock management.
- Cloudflare Pages Functions API backed by Cloudflare D1.
- Stock reservation when an order is placed; stock restoration when an order is rejected/cancelled.

## Cloudflare resources
- Pages project: `metho-lite` (`https://metho-lite.pages.dev`)
- D1 database: `metho-lite-db`
- GitHub production branch: `main`
- Pages API function adapter: `functions/api/[[path]].js`

The D1 binding is configured as `DB` in the Pages production and preview environments.

## First-run checklist
1. Confirm the Pages deployment is successful.
2. Visit `/api/health` and confirm the service responds.
3. Visit `/admin.html` and create exactly two admin accounts. Use separate, strong passwords of at least 12 characters. This setup is one-time.
4. Set prices and stock for all four variants before accepting customer orders.
5. Test a customer order, admin acceptance/rejection, and stock restoration before sharing the store publicly.

## Important operating notes
- No payment gateway is connected. Advance payment is a selection only; payment instructions and verification must be handled manually.
- No Steadfast API is connected. Orders remain in the admin panel until an admin accepts/rejects them. Courier integration is pending API credentials and a separate security review.
- Do not publish the store for advertising until end-to-end order tests, admin tests, Facebook in-app browser tests, backup checks, and realistic load tests pass.
- Do not claim guaranteed 500-concurrent-user capacity without measured load-test evidence.
- Free Cloudflare quotas apply. No paid service or charge may be enabled without explicit approval.

## Feature branch update (2026-11-02)
- Storefront hero copy replaced by administrator-managed image banners.
- METHO green/gold palette and Noto Sans Bengali font applied.
- Header call action and footer WhatsApp/Messenger links are configurable.
- Admin tabs: orders, Steadfast courier queue, products, site design, visitor statistics.
- Customer location form includes district/upazila selectors and GPS-assisted address filling.
- Order IDs use `MLYYMMDD-00001` daily sequence; server enforces a 60-second same-phone order cooldown.
- Courier API booking remains disabled until valid Steadfast credentials are supplied.
- D1 schema additions for settings, banners, visitor analytics, GPS and courier metadata have been applied to the separate METHO Lite database.
- These changes are staged on `lite-redesign-2026-11-02`; the production branch and existing METHO site are not changed.
