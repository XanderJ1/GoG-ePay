---
name: clinika-landing-page
description: Build a calm, editorial landing page using the layout of the "Clinika" reference (dark hero, grotesk headlines with italic-serif accent words, numbered service lists, soft rounded panels), coloured with the GoG ePay app theme from src/app.css. Use when asked to recreate this reference design, or to build a premium landing or marketing page with that look in this app.
---

# Clinika-style Landing Page (GoG ePay Theme)

Recreate the reference page's structure: one dark or editorial hero, then light editorial sections that alternate between image and text, numbered lists, rounded tinted panels, and a dark CTA / safety band before the footer.

**Colours come from the GoG ePay app theme in `src/app.css`, not from the original reference image.** The reference uses teal throughout. Ignore that and apply the tokens in section 2.

Follow the sections **in order**. Keep the copy unless the user gives their own brand or content.

---

## 1. Design principles (do not break these)

1. **Two-voice typography.** Headlines use a clean sans (`'Segoe UI', system-ui, Arial, sans-serif`). One or two key words per headline switch to an *italic serif* (`Georgia, 'Times New Roman', serif`) in the brand accent: Ghana Forest Green (`--primary: #007a3d`) on light backgrounds, Ghana Gold (`--accent: #e8b51b`) on dark ones (for example "Official Government of Ghana *E-Payslip Services*").
2. **Restraint.** Use the GoG ePay palette only, with no extra hues. Most surfaces are white (`#fff`) or soft cream (`--soft: #f7f9f2`); forest green (`--primary: #007a3d`) marks actions; deep hunter green (`--deep: #123d2a`) carries the dark blocks; gold (`--accent: #e8b51b`) is a sparing highlight. Use hairline 1px dividers (`--line: #dce5d9`) instead of heavy shadows.
3. **Numbering as structure.** Services, guides, and benefits are indexed `01`–`05` in small, tabular numerals.
4. **Eyebrows.** Every section opens with a tiny uppercase label: a 4px green or gold dot plus muted, letter-spaced text in a pill badge (`.hero-badge`, `.eyebrow`).
5. **Rounded media.** Photos and panels use a large radius (20–24px). Buttons are full pills (`border-radius: 999px`).
6. **Asymmetric two-column grid.** Text and media sit side by side, responsive and cleanly stacked on mobile without horizontal scroll.

---

## 2. Colour: the GoG ePay app theme

### 2.1 Source of truth

The base colours are defined in `src/app.css`:

| App token | Value | Role on this page |
|---|---|---|
| `--primary` | `#007a3d` | Official Ghana Forest Green: Primary CTAs, active states, accent italic words on light backgrounds |
| `--primary-dark` | `#005f30` | Dark forest green: Button hover/active states, darker accents |
| `--deep` | `#123d2a` | Deep hunter green: Safety callout blocks, dark CTA bands, footer contrasts |
| `--accent` | `#e8b51b` | Ghana Gold / Yellow: Eyebrow dots, accent words on dark, button hover, high-visibility badges |
| `--soft` | `#f7f9f2` | Warm cream / soft off-white: Cards, pill badges, command decks, direct answers |
| `--ink` | `#20382b` | Deep dark green ink: Headings and high-contrast body text |
| `--muted` | `#526657` | Sage slate: Paragraphs, secondary descriptions, labels |
| `--faint` | `#5e6c60` | Faint grey-sage: Captions, minor details, inactive icons |
| `--line` | `#dce5d9` | Soft sage border: Hairline dividers, card outlines |
| Flag gradient | `#bd3e36`, `#e6c85b`, `#397850` | National Red, Gold, Green flag emblem |

**Rules:**
- **Never hard-code arbitrary hex values in components.** Use the CSS custom properties (`var(--primary)`, `var(--deep)`, `var(--accent)`, `var(--soft)`, etc.) defined in `src/app.css`. If the theme changes, the page must follow.
- **Do not introduce colours from the teal reference image** (its teals `#0F3B3E`, `#1E5C5F`, `#E6EFEE` and so on). Apply the authentic Ghana Government green/gold/cream theme.

### 2.2 Derived tokens and variables

```css
:root {
  --on-dark: #ffffff;
  --on-dark-muted: rgba(255, 255, 255, 0.75);
  --glass: rgba(255, 255, 255, 0.10);
  --glass-line: rgba(255, 255, 255, 0.22);

  /* Derived contrast helpers */
  --primary-strong: var(--primary-dark); /* #005f30 */
  --shadow-primary: rgba(0, 122, 61, 0.15);
  --shadow-deep: rgba(18, 61, 42, 0.10);
  --glow-accent: rgba(232, 181, 27, 0.18);
}
```

### 2.3 Colour roles at a glance

| Element | Colour |
|---|---|
| Page background | `#ffffff` with `--soft` (`#f7f9f2`) card sections |
| Hero background | `#ffffff` or gradient to `--soft` / `--deep` (`#123d2a`) |
| Headings | `--ink` (`#20382b`) on light; `--on-dark` (`#ffffff`) on dark |
| Paragraphs | `--muted` (`#526657`) on light; `--on-dark-muted` on dark |
| Eyebrow text, index numbers, captions | `--muted` or `--primary` inside pill badge |
| Eyebrow dot | `--primary` on light, `--accent` on dark |
| Italic accent words | `--primary` on light (headings only); `--accent` on dark |
| Primary button | `--primary` (`#007a3d`) fill with white text; hover `--primary-dark` (`#005f30`) |
| Secondary button | `#ffffff` fill with `--line` border; hover `--soft` with `--primary` text |
| Accent yellow button | `--accent` (`#e8b51b`) fill with `--deep` (`#123d2a`) text |
| Active list row / card | `--primary` border highlight with `--soft` background |
| Inline links | `--primary` (`#007a3d`), underlined |
| Feature cards | `#ffffff` with `--line` border and `--soft` icon badge |
| Tinted command deck (Quick Actions) | `--soft` (`#f7f9f2`) with `--line` border |
| Dark blocks (Safety section, dark CTA) | `--deep` (`#123d2a`) with white text and gold accents |
| Dividers & borders | `--line` (`#dce5d9`) |
| Focus ring | `outline: 3px solid var(--primary); outline-offset: 4px;` |

### 2.4 Contrast guardrails

- `--primary` (`#007a3d`) on white or `--soft` (`#f7f9f2`) is 4.54:1 (passes WCAG AA). Use for large headings, button fills, and bold links.
- `--primary-dark` (`#005f30`) on white or `--soft` is 6.64:1 (passes WCAG AAA).
- `--deep` (`#123d2a`) with white text is 12.8:1 (passes WCAG AAA).
- `--accent` (`#e8b51b`) on `--deep` is 8.4:1 (passes WCAG AAA).
- `--ink` (`#20382b`) on white is 10.7:1 (passes WCAG AAA).
- `--accent` (gold) is **never used as thin text on light backgrounds**; use it on dark backgrounds or as button fills with dark ink text.

---

## 3. Typography and sizing tokens

```css
:root {
  --font-sans: 'Segoe UI', system-ui, Arial, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;

  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --r-xl: 24px;
  --r-pill: 999px;

  --container: min(1120px, calc(100% - 80px));
  --gutter: clamp(16px, 4vw, 40px);
  --section-y: clamp(60px, 8vw, 120px);
}
```

### Type scale

| Role | Size (desktop → mobile) | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Hero H1 | 58px → 38px | 600 | -1.8px | 1.12 |
| Section H2 | 44px → 32px | 600 | -1.4px | 1.18 |
| CTA H2 | 48px → 34px | 600 | -1.2px | 1.15 |
| Card title | 21px → 18px | 600 | -0.4px | 1.3 |
| List item title | 20px → 17px | 600 | -0.3px | 1.35 |
| Body | 17px → 16px | 400 | 0 | 1.7 |
| Small / captions | 13px → 12px | 400 | 0 | 1.5 |
| Eyebrow | 11px uppercase | 700 | 1.5px | 1.4 |
| Index numbers | 13px tabular-nums | 700 | 0 | 1 |

**Accent words:** `font-family: var(--font-serif); font-style: italic; font-weight: 400;`. On light backgrounds, `color: var(--primary)`; on dark backgrounds, `color: var(--accent)`.

---

## 4. Reusable components

- **Eyebrow badge:** `.hero-badge`. A 6px dot (`--primary` on light, `--accent` on dark) plus uppercase letter-spaced text in a pill badge (`--soft` background, `--line` border).
- **Primary pill button:** `.button`. `--primary` fill with white text, min-height 56px, padding `14px 30px`, trailing arrow `→`. Hover: `--primary-dark` with `translateY(-1px)`.
- **Secondary pill button:** `.button.secondary`. White fill, `--line` border, `--ink` text. Hover: `--soft` background, `--primary` text and border.
- **Accent yellow button:** `.button.yellow`. `--accent` fill, `--deep` text, hover `#d6a312`.
- **Verified portal card:** `.portal-verify-card`. Displays live status dot, **SSL Secure** lock badge, and official destination address (`gogepayservices.com`).
- **Quick-Actions command deck:** `.quick-bar`. Numbered action cards (`01`, `02`, `03`) with interactive hover arrows.
- **Service feature card:** `.service-card`. Rounded card (`border-radius: 20px`), category badge tag, icon badge, clear heading, body, and action link.
- **Understanding your payslip breakdown:** Numbered definition cards (`01 Gross pay`, `02 Deductions`, `03 Net pay` + equation).
- **Anti-phishing safety block:** `.safety-section`. Deep green background (`--deep`) with numbered verification rules (`01 Check address`, `02 Keep password secret`, `03 Trust uneasy feeling`).
- **FAQ Accordion:** `<details>/<summary>` with smooth open/close and plus/minus indicator.

---

## 5. Page structure and content

### 5.1 Utility bar & Header
- **Utility strip:** Background `#fff`, font-size 13px. National flag emblem (`.flag`), text `Government of Ghana / Employee Pay Services`, and link to `Staying safe online` (`/security/`).
- **Header:** Height ~88px–112px.
  - **Left:** CAGD crest logo + brand title `GoG ePay Services` with subtitle `FOR THE PEOPLE WHO SERVE GHANA`.
  - **Right (Desktop):** Navigation links (`About`, `How it works`, `Help & FAQs`) + primary button **Log in to portal**.
  - **Right (Mobile):** Hamburger toggle button opening accessible mobile menu.

### 5.2 Hero section
- Two columns (desktop): Left content (~55%), Right photo card (~45%).
- **Left column:**
  - Eyebrow badge: `• WELCOME TO GOG EPAY SERVICES` in soft pill with pulse dot.
  - H1: `Official Government of Ghana` *`E-Payslip Services`*. The accent phrase is in italic serif `var(--primary)`.
  - Intro paragraph: "No queues, no chasing anyone down. Sign in to the portal and see your electronic payslip in a few quiet minutes."
  - **Trust chip row:**
    - 🛡️ `Verified CAGD Portal`
    - 💳 `Ghana Card Enabled`
    - ⏱️ `24/7 Self-Service`
  - **Buttons:** **Go to my payslip →** (primary) and **First time? We’ll walk you through it** (secondary pill).
  - **Verified portal destination card:** Live status indicator, SSL Secure badge, and link to `gogepayservices.com`.
- **Right column:**
  - Status pill: `• For All Government of Ghana Employees` overlapping the top edge.
  - Portrait of employee checking phone in pleasant natural light.
  - Glassmorphic caption: `ONE LESS THING TO WORRY ABOUT.` / **Check your pay, then get on with your day.**

### 5.3 Quick-Actions command deck
- Container in `--soft` with `--line` border and soft shadow.
- Heading: Gold lightning icon + "What can we help you with?".
- 3 interactive action cards:
  - `01 Open my payslip`: Direct link to portal (`gogepayservices.com`) with `→`.
  - `02 Help me sign in`: Link to tutorial (`#guide`) with `↓`.
  - `03 I have a question`: Link to FAQs (`#help`) with `↓`.

### 5.4 Core services (`#services`)
- Eyebrow: `HERE TO MAKE THINGS EASIER`.
- H2: `Start here.` with a line break, then `Understand your pay with confidence.`
- 3 feature cards in a responsive grid:
  1. `01` **See your payslip** (Tag: `PORTAL ACCESS`) → "Take me to the portal →".
  2. `02` **Make sense of the numbers** (Tag: `PAYROLL GUIDE`) → "Explain it simply →".
  3. `03` **Get a hand when you’re stuck** (Tag: `SUPPORT & FAQS`) → "Find an answer →".

### 5.5 Official guides (`#guide`)
- Eyebrow: `OFFICIAL GUIDES`.
- H2: `Get set up. Find your payslip.`
- 4 guide cards (`/help/register/`, `/help/sign-in/`, `/help/reset-password/`, `/help/view-payslip/`).
- Includes official domain verification box (`OfficialDomains.svelte`).

### 5.6 Understanding your payslip (`#understand`)
- Two columns: Left introduction, Right numbered terms.
- Eyebrow: `NO ACCOUNTING DEGREE NEEDED`.
- H2: `Reading your payslip, made easy.`
- 3 numbered terms:
  - `01` **Gross pay**: What you’ve earned before anything is taken out.
  - `02` **Deductions**: Money taken from earnings (taxes, pension, etc.).
  - `03` **Net pay**: What’s left after deductions.
- Visual formula box: `Gross pay − Deductions = Net pay`.

### 5.7 Anti-phishing security section (`#safe`)
- Full dark block in `--deep` (`#123d2a`) with white text and gold accents.
- Left column:
  - Eyebrow: `A QUICK MOMENT OF CARE` (gold dot).
  - H2 in white: `Look twice at the address. It keeps you safe.`
  - Prominent verified domain badge: `gogepayservices.com`.
- Right column: 3 numbered security cards (`01 Check address letter by letter`, `02 Keep password to yourself`, `03 Trust that uneasy feeling`).

### 5.8 FAQ & Support routing (`#help`)
- Left column: Eyebrow `QUESTIONS ARE WELCOME`, H2 `Let's sort it out together`, plus dedicated HR/payroll support advisory.
- Right column: Expandable accordion items for common employee questions.

### 5.9 Direct answers & AEO
- Prerendered question-and-answer pairs rendered via `DirectAnswers.svelte` and backed by `Schema.org` JSON-LD.

### 5.10 Closing CTA banner
- Eyebrow: `READY WHEN YOU ARE`.
- H2: `Your payslip is a few clicks away. Then the day is yours.`
- Action: **Take me to GoG ePay Services** (`.button.yellow`), pointing to `gogepayservices.com`.

### 5.11 Footer
- Left: CAGD logo + brand wordmark + tagline.
- Link columns: *Get started* and *Need a hand?*.
- Bottom bar: Copyright, official Government of Ghana notice, and verified portal address.

---

## 6. Spacing and layout rules

- Center the container at `width: min(1120px, calc(100% - 80px))` with `margin-inline: auto`.
- Space sections with `padding-block: clamp(60px, 8vw, 120px)`.
- Use 64px column gaps on desktop, 40px on tablet, and stacked on mobile.
- Leave 16px between eyebrow and H2, 24px between H2 and intro paragraph, and 28px between intro and buttons.
- Keep paragraph max-width at 60ch or less.

---

## 7. Responsive behavior

| Breakpoint | Changes |
|---|---|
| ≥1024px | Full two-column layout as described above |
| 768–1023px | Hero photo height adjusts to 400px. Quick actions and service grid stack to single or double columns. |
| <768px | Every section becomes single column. Actions stack vertically (`width: 100%`). Status pill becomes static. Service grid stacks cleanly. |
| ≤380px | Container margin adjusts to `calc(100% - 24px)`. Hero H1 scales to 32px. No horizontal scroll (`scrollWidth <= innerWidth`). |

---

## 8. Motion (subtle)

- Button hover: `transform: translateY(-1px)` with smooth background transition (150ms).
- Card hover: `transform: translateY(-4px)` with shadow elevation and border accent.
- Micro-interactions: Arrow icons slide 3–4px right on button/card hover.
- Respect `prefers-reduced-motion: reduce` by turning off transforms and transitions.

---

## 9. Accessibility

- Use semantic landmarks (`header`, `nav`, `main`, `section[id]`, `footer`) with exactly one `h1`.
- Mark italic accent words up with `<em>`.
- Follow WCAG AA contrast rules (Forest green on cream/white ≥ 4.5:1; white on deep green ≥ 12:1).
- Every image requires meaningful `alt` text.
- Focus rings use `outline: 3px solid var(--primary); outline-offset: 4px; border-radius: 4px;`.
- Touch targets must be at least 44px tall.

---

## 10. Build checklist

- [ ] All colours use tokens from `src/app.css` (`--primary`, `--primary-dark`, `--deep`, `--accent`, `--soft`, `--ink`, `--muted`, `--line`); no hardcoded unapproved hexes
- [ ] No reference-image teal colours
- [ ] Exactly one `h1` on the homepage (`Official Government of Ghana <em>E-Payslip Services</em>`)
- [ ] Section anchors preserved: `#main`, `#services`, `#guide`, `#understand`, `#safe`, `#help`
- [ ] Numbering `01`–`03` consistent across Quick Actions, Services, and Safety points
- [ ] Mobile layout verified at 320px with zero horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`)
- [ ] Passes `npm run check`, `npm test`, `npm run build:preview`, `npm run test:seo`, and `npm run test:browser`
