# SYLUTION TRADE — Code Audit / 27 November 2026

Scope: GitHub main branch of `smbabanbaba-maker/sylutionshop`. Source-code audit plus Vercel build-status inspection; **not** a full cross-device functional/security penetration test.

## Findings by area

| Area | Current implementation | Important remaining gap | Priority |
|---|---|---|---|
| Register and login | Browser-local demo profile, country picker and role selector | Real Supabase Auth, secure passwords, sessions, reset, email confirmation, protected routing | Critical |
| Global country data | ISO-style countries and territories; image flags from FlagCDN | Visual testing of all country options and accessibility; separate phone, entity registration, origin and shipping countries | High |
| Regional defaults | Saved country drives country flags, approximate calling code and local currency defaults | Local defaults aren't FX quotes; allow overrides; full profile synchronization needs backend | Medium |
| KYC and KYB | Country-aware preparatory guidance, local file picker, unverified states | Provider/authority-backed rules, licensed verification, sensitive encrypted uploads, true OTP, review workflow, consent/retention/deletion policies | Critical |
| Seller identity | Local business details and logo/cover URL preview | Legal entity matching, ownership proof, verified badges issued only after review | High |
| Product listing | Local product drafts, photo previews, editable products | Persistent database, authorized seller publishing, secure media storage, real inventory and moderation | Critical |
| Marketplace | Sample product list and categories with search/filter | Actual seller-generated global catalog, verified supplier status, actual ratings/reviews only, pagination/indexing | High |
| RFQ and supplier enquiries | Local RFQ drafts, images preview, contact forms | Authenticated delivery to chosen supplier, spam controls, shipping-country validation and notifications | Critical |
| Messages | Local browser previews | Two-party secure conversations, permissions, file security, delivery/read status, notifications | Critical |
| Quotations | Demo quotation drafts with currency and seller/buyer workflow UI | Authenticated recipient, versioning, acceptance authorization, expiration and immutable history | High |
| Orders | Manual demo status linked to accepted quotations | Real agreement lifecycle, role-specific updates, shipment evidence, dispute reporting and audit logs | High |
| Payment model | Direct buyer-to-seller payment disclaimer | Clear terms/privacy; external payment risk and complaints; SYLUTION should not imply escrow | High |
| Trust/safety | Fraud warnings and browser-local report drafts | Confidential live complaints portal, moderation queue, escalation process and official reporting contacts | Critical |
| Admin | Public read-only /admin demonstration | Server-authorized staff access, MFA, RBAC, verification queues, audit logs | Critical |
| Analytics and notifications | Local activity summary, static demo statistics | Analytics backend, reliable notification delivery and attribution | Medium |
| Responsive design | CSS breakpoints, mobile layouts | Device-level manual browser testing including overflow, keyboard focus, 320/375/768/1024/1440 widths | High |
| Data isolation | Many demo records in common localStorage keys | Per-account row-level permissions and secure server ownership. **Demo is not safe multi-tenant isolation.** | Critical |

## Fixes made in this audit

- Added `lib/verification-guidance.ts`: illustrative country-specific business-document preparation, with a generic fallback and explicit regulatory caveat.
- Updated `VerificationPanel.tsx`: guide matched to registered country and seller/buyer role; proof of prior import explicitly optional; document selection remains local only.
- Updated `DemoAccount.tsx`: passes role to verification guidance, changes misleading demo "Log in" label to "Try demo", and clears registration preview inputs when reopening.
- Added global-document help styling for desktop and mobile.
- Updated `SupplierStorefront.tsx` to show real-image country flag next to location.
- Updated `BuyerProfileEditor.tsx` to avoid defaulting each supplier business to "Buying Office", accept exporter/service provider, treat store cover as URL and validate essential identity fields.

## UX / domain rules to preserve

1. The **registered country** defaults identity/phone/currency fields, but is distinct from product origin, supplier market and order destination.
2. A country image comes from the national/territorial flag data source. On error, display a neutral ISO code — no fabricated flag.
3. No fake confirmed reviews, statistics, verified badges, delivery completion or payment confirmations.
4. Business registration requirements vary by country **and entity type**, not solely by nationality.
5. Trade history is optional for new companies. Do not require proof of prior import universally.
6. SYLUTION is an intermediary; the buyer and seller arrange payment directly; SYLUTION is not an escrow provider.

## Production release blockers

- No verified connected production database/auth credentials in the Vercel project as inspected earlier.
- UI forms currently use browser storage and cannot be relied on for cross-user workflows or protected business records.
- Sensitive KYC documents must not be uploaded until a privacy-reviewed, authorized and secure server workflow exists.
- Automated and manual tests still needed. A successful Vercel build verifies compilation, not full business behavior.

**Next implementation milestone:** Secure auth + database schema/RLS + KYC provider/provider-neutral review API; only afterward wire product publication, real messaging, order actions and admin controls.
