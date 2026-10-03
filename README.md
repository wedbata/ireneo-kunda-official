# Ireneo Kunda Complex School Website

A modern, fast, responsive school website for Ireneo Kunda Complex in Wau, South Sudan. Built with clean semantic HTML5, a single consolidated CSS design system (`css/style.css`), and a single unified vanilla JavaScript application (`js/main.js`).

## 🌟 Architecture & Highlights

- **Single Consolidated CSS (`css/style.css`)**: Token-driven CSS custom properties (`:root`), full dark mode (`prefers-color-scheme: dark`), responsive grid layouts, prominent logo styling, and smooth scroll animations.
- **Single Unified JavaScript (`js/main.js`)**: All navigation, responsive drawer, filterable gallery, modal lightbox, admission tabs, and form validation are managed in one modular, lightweight script.
- **Standalone & Offline Resilient (`file://` & HTTP)**: Includes embedded fallback dataset for gallery items, allowing the website to be opened directly from the filesystem without CORS errors, while seamlessly fetching from `data/*.json` when hosted on a web server.
- **Dedicated Leadership & Administration Profiles (`profile.html`)**: Features detailed profiles, titles, images, and quotes for the founder, principal, and head teachers.
- **Zero Framework Overhead**: 100% vanilla HTML5, CSS3, and ES6+ JavaScript. Fast loading and optimized for low-bandwidth environments.

---

## 📁 File Structure

```
ireneo-kunda-website/
├── index.html              # Homepage with leadership preview
├── about.html              # About the school (Mission, Vision, Values, Facilities)
├── profile.html            # Leadership & Administration profiles
├── programs.html           # Programs (Nursery, Primary, Secondary, Extra-Curricular)
├── admissions.html         # Admissions (Process, Requirements Tabs, Fees, Online Form)
├── gallery.html            # Photo gallery with category filters & lightbox modal
├── contact.html            # Contact info, map, visit details & inquiry form
├── css/
│   └── style.css          # Consolidated stylesheet (Tokens, Themes, Profiles, Layouts)
├── js/
│   └── main.js            # Single consolidated JavaScript application
├── data/
│   └── gallery.json       # Gallery data (Optional HTTP CMS)
├── images/
│   ├── logo/              # School logo
│   ├── profiles/          # Leadership portrait photos
│   └── gallery/           # School photo assets
└── README.md              # Project documentation
```

---

## 👥 Leadership Profiles

- **Eng. Ireneo Kunda Tabour**: Founder & Patron
- **Dr. Cleto I. Kunda Tabour**: Principal & Managing Director
- **Mr. Simon Luciano**: Head Teacher — Secondary School
- **Adiama Andrea**: Head Teacher — Primary School
- **Mrs. Janet Edward**: Head Teacher — Nursery School

---

## 🚀 Quick Start

### 1. Direct Browser Access (Offline / Local)
Simply double-click `index.html` (or open any `.html` file) in any modern browser. No web server is required.

### 2. Local Web Server (Optional)
To test over HTTP:

**Python:**
```bash
python -m http.server 8000
```
Visit `http://localhost:8000`

**Node.js / npx:**
```bash
npx serve .
```

---

## 🎨 Theme & Styling Tokens

All colors, spacing, radii, and shadows are defined as CSS variables at the top of `css/style.css`:

```css
:root {
    --primary-color: #2d8a5e;      /* Forest Green */
    --secondary-color: #ff8c42;    /* Warm Amber */
    --accent-color: #4f46e5;       /* Indigo Accent */
    /* ... */
}
```

Dark mode is handled automatically via `@media (prefers-color-scheme: dark)` with accessible contrast levels.

---

## 🌐 Browser Support
- Chrome, Edge, Firefox, Safari, Opera (Desktop & Mobile)
- Responsive down to 320px mobile screens
