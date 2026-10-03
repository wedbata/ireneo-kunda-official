# Ireneo Kunda Complex — UI Review

**Audited:** 2026-10-03  
**Baseline:** Abstract 6-Pillar Standards (Vanilla HTML5 / CSS3 / ES6 JS)  
**Screenshots:** Not captured (no local dev server active on ports 3000, 5173, or 8080 — code-level adversarial audit)  

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Developer CMS instructions exposed on public pages; inconsistent copyright strings; non-clickable phone/email text. |
| 2. Visuals | 2/4 | Heavy reliance on blank icon placeholder boxes; zero real imagery on About page; static non-interactive map block. |
| 3. Color | 3/4 | Core 60/30/10 green/orange palette applied well, but hardcoded RGBA values bypass tokens and dark mode has yellow glare bugs. |
| 4. Typography | 3/4 | Clean 4-weight hierarchy and system stack, but fragmented across 15 distinct font size values without scale tokens. |
| 5. Spacing | 3/4 | Five-tier spacing token system in place, but missing intermediate steps (0.75rem, 1.5rem) causing arbitrary rem overrides. |
| 6. Experience Design | 1/4 | **BLOCKER:** Gallery modal lightbox is completely non-functional; form validation fails to highlight missing required fields. |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **Fix Broken Gallery Modal Lightbox Selector (`js/gallery.js:101, 135`)** — *BLOCKER*  
   - **User Impact:** Clicking any gallery image does nothing. The lightbox modal never opens, completely breaking the gallery viewing experience.  
   - **Concrete Fix:** In `js/gallery.js`, remove `document.querySelectorAll('.gallery-item[style*="display: block"]')` (which evaluates to empty because `renderGallery` does not set inline styles). Instead, query `.gallery-item` directly or index into the active filtered image array (`filteredImages[index]`).

2. **Fix Required Field Validation State and Error Indicators (`js/admissions.js:89-94`, `js/contact.js:71-76`)** — *BLOCKER*  
   - **User Impact:** When a user submits an application or contact form with empty required fields, no fields are highlighted with `.error` borders or rings. Users cannot tell which field is missing among 10+ inputs.  
   - **Concrete Fix:** Update `validateField(field)` in both JS files so that `if (!isValid)` applies `.error` regardless of whether `value` is empty. Add explicit `<span class="form-error">Please fill out this field</span>` elements into each `.form-group` in `admissions.html` and `contact.html`.

3. **Remove Internal CMS / Developer Setup Sections from Public Pages (`gallery.html:145-155`, `announcements.html:58-68`)** — *WARNING*  
   - **User Impact:** Public visitors (parents, students) see internal instructions telling them to place files in `images/gallery/` and edit `data/announcements.json`.  
   - **Concrete Fix:** Delete `<section class="upload-info">` in `gallery.html` and `<section class="admin-info">` in `announcements.html`. Retain developer guidance exclusively in `README.md` and `SETUP-GUIDE.md`.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

- **[BLOCKER] Internal CMS instructions exposed in public UI:**
  - `gallery.html:145-155`: Displays `<section class="upload-info">` with text `"To add photos to this gallery, place your images in the images/gallery/ folder and update the data/gallery.json file with photo information."`
  - `announcements.html:58-68`: Displays `<section class="admin-info">` with text `"To add, edit, or remove announcements, update the data/announcements.json file."`
  - *Recommendation:* Remove these sections entirely from user-facing HTML templates.

- **[WARNING] Inconsistent copyright notice:**
  - `admissions.html:384`: `<p>&copy; 2026 Ireneo Kunda Complex By George. All rights reserved.</p>` diverges from the other 6 pages (`index.html:201`, `about.html:223`, `programs.html:317`, `gallery.html:201`, `announcements.html:105`, `contact.html:236`) which state `<p>&copy; 2026 Ireneo Kunda Complex. All rights reserved.</p>`.
  - *Recommendation:* Normalize `admissions.html:384` to match standard site copyright.

- **[WARNING] Plaintext contact data without actionable URI protocols:**
  - Across all 7 page footers and `contact.html:68-87`, phone numbers (`+211910185396`) and email addresses (`cletokunda@yahoo.com`) are plain text.
  - *Recommendation:* Wrap in `<a href="tel:+211910185396">` and `<a href="mailto:cletokunda@yahoo.com">`.

- **[WARNING] Dead social link anchors:**
  - 23 social icons across all pages use `href="#"` without valid destinations or fallback tooltips.
  - *Recommendation:* Provide actual school social URLs or replace with specific contact channels (e.g. direct WhatsApp link `https://wa.me/211910185396`).

---

### Pillar 2: Visuals (2/4)

- **[BLOCKER] Heavy reliance on placeholder graphics instead of photographic assets:**
  - `index.html:97-100`: "About Preview" uses `<div class="image-placeholder"><i class="fas fa-school"></i></div>`.
  - `about.html:1-230`: The dedicated About page contains no campus photos, faculty images, or classroom visuals.
  - `contact.html:178-180`: "Visit Our School" uses an empty gradient icon box instead of real school grounds photography.
  - ~~`contact.html:193-198`: "Find Us" renders a static icon gradient (`.map-placeholder`) without street context or interactive map tiles.~~ **RESOLVED:** "Find Us" now embeds an interactive Google Map (`.map-embed`) with a "Get Directions" button.
  - *Recommendation:* Utilize the existing images in `images/gallery/` (such as `campus-building.jpg`, `campus-assembly.jpg`, `students-group-1.jpg`) on the Home, About, and Contact pages.

- **[WARNING] Competing visual hierarchy in Hero CTAs:**
  - `index.html:48-49`: `.btn-primary` and `.btn-secondary` both have strong solid fills and shadows without clear primary vs. secondary distinction.
  - *Recommendation:* Style the secondary CTA with a ghost / outline style (`border: 2px solid white; background: transparent;`) to establish a single dominant focal point.

---

### Pillar 3: Color (3/4)

- **[WARNING] Hardcoded color values bypassing CSS custom properties:**
  - Hardcoded RGBA primary shadow: `rgba(45, 138, 94, 0.2)` / `0.3` / `0.25` / `0.35` hardcoded at `css/style.css:83, 84, 130, 131, 232, 259, 260, 267, 299, 418`.
  - Hardcoded secondary shadow: `rgba(255, 140, 66, 0.2)` / `0.3` at `css/style.css:92, 93`.
  - Hardcoded message backgrounds: `#fff3cd` (`css/style.css:278`), `#d1fae5` (`css/style.css:311`), `#fee2e2` (`css/style.css:312`).
  - Hardcoded inline style in script: `color: #9ca3af` at `js/gallery.js:28`.
  - *Recommendation:* Declare `--primary-shadow: rgba(45, 138, 94, 0.25);`, `--secondary-shadow: rgba(255, 140, 66, 0.25);`, `--success-bg: #d1fae5;`, and `--error-bg: #fee2e2;` in `:root` and dark mode blocks.

- **[WARNING] Unused design token:**
  - `--accent-color: #4f46e5;` (and dark mode `#7c3aed`) is declared in `css/style.css:9, 46` but never used anywhere in the CSS rules.
  - *Recommendation:* Apply `--accent-color` to badges, category tags, or remove the dead token.

- **[WARNING] Dark mode alert contrast issues:**
  - In dark mode, `.fees-note` (`css/style.css:278`) renders with hardcoded light yellow background `#fff3cd`, creating an intense glare artifact and illegible dark text against the dark theme.
  - *Recommendation:* Add `.fees-note` dark mode override using `var(--border-color)` and a subdued amber tint.

---

### Pillar 4: Typography (3/4)

- **[WARNING] Font size fragmentation (15 distinct font sizes):**
  - Sizes in active use: `0.65rem` (10.4px), `0.75rem` (12px), `0.85rem` (13.6px), `0.9rem` (14.4px), `0.95rem` (15.2px), `1rem` (16px), `1.1rem` (17.6px), `1.25rem` (20px), `1.3rem` (20.8px), `1.5rem` (24px), `1.75rem` (28px), `2rem` (32px), `2.2rem` (35.2px), `2.5rem` (40px), `3rem` (48px).
  - *Recommendation:* Consolidate into a strict 6-step type scale (`--text-xs: 0.75rem`, `--text-sm: 0.875rem`, `--text-base: 1rem`, `--text-lg: 1.25rem`, `--text-xl: 1.5rem`, `--text-2xl: 2rem`, `--text-3xl: 2.5rem`).

- **[PASS] Font family and weight hierarchy:**
  - System font stack `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` is consistently applied.
  - Weights are well-structured: 300 (subtitles), 500 (navigation), 600 (CTAs/labels), 700 (headings).

---

### Pillar 5: Spacing (3/4)

- **[WARNING] Hardcoded padding/margin values bypassing spacing tokens:**
  - Button padding: `padding: 0.75rem 1.5rem;` (`css/style.css:80`), `padding: 1rem 2.5rem;` (`css/style.css:95`).
  - Nav link padding: `padding: 0.6rem 1.2rem;` (`css/style.css:123`), `padding: 0.65rem 1.8rem;` (`css/style.css:130`).
  - Input padding: `padding: 0.875rem;` (`css/style.css:298`).
  - List item gap: `gap: 0.75rem;` (`css/style.css:189, 219, 251, 274, 288, 367`).
  - *Recommendation:* Expand token scale to include `--spacing-2xs: 0.25rem`, `--spacing-xs: 0.5rem`, `--spacing-sm: 0.75rem`, `--spacing-md: 1rem`, `--spacing-lg: 1.5rem`, `--spacing-xl: 2rem`, `--spacing-2xl: 3rem`.

- **[PASS] Grid and layout structure:**
  - Page containers (`max-width: 1200px`) and responsive grids (`.programs-grid`, `.info-grid`, `.footer-grid`) use consistent gutter spacing and align cleanly across screen widths.

---

### Pillar 6: Experience Design (1/4)

- **[BLOCKER] Non-functional Gallery Lightbox Modal (`js/gallery.js:101-104, 135`):**
  - `openModal(index)` executes `const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"]');`.
  - Since items rendered by `renderGallery()` do not have inline `display: block`, `visibleItems` is always empty.
  - Clicking any gallery item fails immediately on `if (!clickedItem) return;`.
  - Next/previous controls inside the modal fail on the same selector.
  - *Recommendation:* Query `.gallery-item` directly without the inline style attribute check.

- **[BLOCKER] Form validation fails to mark empty required fields (`js/admissions.js:89-94`, `js/contact.js:71-76`):**
  - `validateField(field)` checks `if (!isValid && value) { formGroup.classList.add('error'); }`.
  - When a required field is empty (`value === ""`), this condition evaluates to `false`. The field is never styled with the `.error` red border or shadow.
  - When the user clicks "Submit", they receive a generic message at the bottom with zero visual cues on which of the 10+ inputs failed validation.
  - *Recommendation:* Remove `&& value` check so that `!isValid` always applies `.error` class.

- **[WARNING] Missing form error message elements in HTML markup:**
  - `css/style.css:305-306` defines `.form-error { color: var(--error-color); ... }` and `.form-group.error .form-error { display: block; }`.
  - However, neither `admissions.html` nor `contact.html` contains any `.form-error` elements inside `.form-group`.
  - *Recommendation:* Add `<span class="form-error">This field is required</span>` under required inputs.

- **[WARNING] Inconsistent announcements container IDs across pages:**
  - `index.html:148`: `<div id="announcements-list" ...>` (kebab-case).
  - `announcements.html:51`: `<div id="announcementsList" ...>` (camelCase).
  - *Recommendation:* Standardize on `#announcements-list` across all templates.

- **[WARNING] Incomplete ARIA accessibility attributes:**
  - Mobile menu toggle (`js/main.js:11`) does not toggle `aria-expanded="true/false"`.
  - Lightbox modal (`gallery.html:158`) lacks `role="dialog"`, `aria-modal="true"`, and keyboard focus trapping.
  - *Recommendation:* Add dynamic `aria-expanded` toggling and modal ARIA attributes.

---

## Files Audited

- `C:/Users/wedba/Desktop/ireneo-kunda-website/index.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/about.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/programs.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/gallery.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/contact.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/announcements.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/admissions.html`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/css/style.css`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/js/main.js`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/js/admissions.js`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/js/contact.js`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/js/gallery.js`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/js/announcements.js`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/data/announcements.json`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/data/gallery.json`
- `C:/Users/wedba/Desktop/ireneo-kunda-website/README.md`
