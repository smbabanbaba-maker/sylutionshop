# SYLUTION TRADE — production launch gates

Status: **UI and same-browser workflow demonstration. Not a production marketplace.**

## Commercial model
- Direct buyer-to-seller quotations, agreements and payment outside SYLUTION.
- SYLUTION does **not** collect or hold the purchase price, offer escrow, release funds or guarantee delivery.
- Revenue, when implemented, may come from optional seller membership and paid promotions, not purchase escrow.
- Payment for SYLUTION's own subscriptions requires a separate licensed provider, invoices, refunds and compliance review.

## Implemented screens
- Marketplace search, categories, sample products and supplier preview stores.
- Buyer and supplier demo account workspace, profile, verification preparation.
- One-page product draft form, local draft listing/edit/delete (photos preview locally only).
- RFQ creation with local image previews.
- Messaging draft UI, seller contact preview.
- Quotation form, status and linked demo order creation; local order status controls.
- Activity Center reading local drafts, reports and trade records.
- Report & Safety Center; read-only /admin UI demonstration.
- Direct-payment disclosure on listing, seller and sourcing entry points.

## Not yet connected — required before accepting real users
1. **Database & Auth:** Provision a controlled Supabase/PostgreSQL project, configure encrypted environment variables, secure sign-up/sign-in, email confirmation, password reset and server-side role checks.
2. **Row-level security:** Bind every product, quote, RFQ, order, message, report and business to authenticated owner/member IDs. Define explicit RLS policies, test tenant isolation and prevent IDOR. Current `supabase/schema.sql` is a starting draft, not a complete production policy.
3. **Media storage:** Secure signed image uploads, content type and size validation, authorization and virus/content review. Local image previews must not be mistaken for uploaded assets.
4. **Publication:** Server-controlled draft/submitted/approved/published states; catalog search indexed from DB, not `lib/catalog.ts` sample data.
5. **Messaging & notifications:** Authenticated two-party conversations, rate limits, abuse prevention, delivery tracking, email/in-app notifications and attachments.
6. **Quotations & orders:** Role-based access and immutable audit logs. Accepting a quotation must only be possible by its intended buyer; shipping milestones only by authorized seller/admin. Do not infer payment status from manually-entered order states.
7. **Verification & safety:** Private encrypted KYC document handling, restricted staff review, audit logs, report triage, official abuse contact and clear refund/dispute disclaimers.
8. **Administration:** Server-authenticated admin role, MFA, RBAC and non-client-only authorization for moderation. The public `/admin` preview must not gain privileged actions until these are implemented.
9. **Own-service billing:** If paid memberships are launched, integrate compliant provider settlement for SYLUTION fees only, with webhooks, idempotency and reconciliation.
10. **Quality:** Automated tests, accessibility, security review, 320/375/768/1024/1440px browser visual checks, observability, backup/restore, incident playbooks and privacy terms.

## Environment inspection on 27 November 2026
Vercel project `prj_VKnX71tSM4fQq75NxiVwU3Ko9tB1` had **zero project environment variables** listed. There is no verified live database connection.

## Release rule
Do not remove the `Demo` and `Local only` labels until server-backed accounts, tenant permissions, persistence, media upload and production workflows have passed end-to-end tests.
