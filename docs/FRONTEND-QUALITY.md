# SYLUTION frontend quality checklist

This codebase is a working **prototype**, not a production B2B marketplace.

## Implemented
- Shared brand palette in `app/styles/brand.css`.
- Existing styles split into `globals.css`, `product.css`, `dashboard.css`, `brand.css`, and `workflows.css` without changing their cascade order.
- Responsive navigation and mobile cards, with reduced-motion preference.
- Consistent CountryFlag component with PNG and emoji fallback.
- Favorites stored locally and synchronized between product cards, detail views and account dashboard.
- Product page uses one available image rather than suggesting four distinct photos.
- Buyer RFQ form stores demo draft locally; request list searches and deletes locally.
- Buyer messages shows an empty inbox; it does not falsely claim real conversations.
- Loading, error and not-found states.

## Launch blockers
- Replace demo signup with secure Supabase Auth; establish buyer/supplier role policies and RLS.
- Complete product/marketplace data model, real inventory, moderated supplier onboarding and verified badges.
- Remove sample price/market/rating metrics or label as demonstration until independently sourced.
- Ensure each image actually matches its product. Several stock images in the sample catalog are placeholders.
- Add accessible form validation, integrated chat, notifications and quotes on the backend.
- Add automated component tests, end-to-end tests and CI checks.
- Test all routes with keyboard and screen readers on mobile and desktop.
- Run Lighthouse/Core Web Vitals against deployed site; current values are not yet measured.
- Re-enable search indexing only when product/catalog data are real, with appropriate canonical domain.

## Manual QA
1. On mobile widths 320, 375, 768px and desktop 1440px, open Home, Product Detail and Account.
2. Verify search, country filters, Load More, responsive nav, RFQ form, Favorites and dashboard counts.
3. Check flags for Nigeria, China, India, Germany, Brazil and Vietnam.
4. Save a product, open account Favorites, remove it, return to product detail and confirm state.
5. Save a buyer RFQ and verify request table update, search and delete.
6. Confirm no indication that the prototype has verified suppliers or delivers real messages.

Keep brand-focused CSS overrides small; prefer editing component-level styles instead of adding further `!important` rules. 
