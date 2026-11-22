# SYLUTION Design System (2026)

The visual system is applied in `app/styles/theme.css`, loaded **after** legacy styles. Prefer editing this consolidated file instead of appending one-off `!important` overrides elsewhere.

## Color tokens

| Role | Token | Hex | Meaning |
|---|---|---|---|
| Primary navy | `--sy-color-navy` | #10283F | Heading, supplier nav and tables |
| Brand teal | `--sy-color-brand` | #007E76 | Primary actions, selected states |
| Brand hover | `--sy-color-brand-hover` | #00645D | Active pointer feedback |
| Royal blue | `--sy-color-royal` | #1658A5 | Brand gradient / corporate identity |
| Success | `--sy-color-success` | #087D42 | **Actually verified** states |
| Pending | `--sy-color-warning` | #A46911 | Review pending |
| Unverified/danger | `--sy-color-danger` | #B53C35 | Missing confirmation / error |
| Information | `--sy-color-info` | #206B9B | Neutral information prompts |
| Canvas | `--sy-color-canvas` | #EDF3F7 | Background |
| White surface | `--sy-color-surface` | #FFFFFF | Cards and forms |
| Border | `--sy-color-border` | #D7E3E9 | Outlines |

### Layout rules
- Use spacing increments of 4/8/12/16/24/32px.
- Interactive controls should target a minimum 44×44px touch area.
- Use one of `--sy-radius-sm/md/lg` for cards and inputs.
- Product/supplier data remain visibly marked DEMO pending actual Supabase data.
- Country flags use the reusable `CountryFlag` component (country image + emoji fallback), not manually created flag icons.
- Never display a green verification status for an account that has not passed a real verification process.
- No invented metrics, badges, verified seller counts or testimonials.

### Current limitations
This pass aligns styling across pages and reduces visual inconsistency; it does **not** establish screenshot-perfect QA, screen-reader coverage or Lighthouse results. The pre-existing styles still contain `!important` overrides; a further staged component-level refactor should remove them with regression tests. Supabase and real authentication are still pending.
