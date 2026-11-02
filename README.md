# METHO Lite

A separate, lightweight, mobile-first storefront for the METHO brand. This repository does not modify the existing METHO production website.

## Included
- Bengali storefront for jhola and patali date-palm jaggery, with 1 kg and 2 kg variants.
- COD and advance-payment order selection.
- Two-admin first-run account setup, login, order review, accept/reject, and status updates.
- Variant price and stock management.
- Cloudflare Worker API, D1 schema/migration, and static assets.
- Atomic stock reservation when an order is placed; stock is restored when an order is rejected/cancelled.
- GitHub Actions JavaScript syntax checks.

## Stack
- Cloudflare Workers static assets
- Cloudflare Workers API
- Cloudflare D1

## Setup required before deployment
1. Create a D1 database named `metho-lite-db` in the Cloudflare account.
2. Put its database ID into `wrangler.toml` in place of `REPLACE_WITH_D1_DATABASE_ID`.
3. Install dependencies with `npm install`.
4. Apply the D1 migration with `npx wrangler d1 migrations apply metho-lite-db --remote`.
5. Deploy with `npx wrangler deploy`.
6. Visit `/admin.html` once and create exactly two admin accounts. Use strong, unique passwords of at least 12 characters.
7. Set prices and stock for all four variants in the admin panel before accepting customer orders.

## Important operating notes
- No payment gateway is connected. Advance payment is only a selected payment method; payment instructions must be confirmed manually.
- No Steadfast API is connected. Orders remain in the admin panel until an admin accepts/rejects them. Courier integration is intentionally pending API credentials and a separate security review.
- The app is not yet production-ready: perform database migration tests, security review, real-device testing (including Facebook in-app browser), backup checks, and load tests before advertising it.
- Free Cloudflare plans have daily usage quotas. 500 concurrent users must be validated by realistic load testing; it is not a guaranteed capacity claim.
- Do not enable paid Cloudflare services or incur charges without explicit approval.

## Current status
Source files are committed. JavaScript syntax CI passed. Cloudflare database creation, deployment, end-to-end tests, Facebook in-app browser tests, and load tests are not yet complete.
