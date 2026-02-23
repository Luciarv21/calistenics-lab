# Calisthenics Skill Lab Amsterdam

A simple, modular website for a calisthenics coach.

## Project structure

```
├── index.html
├── vite.config.js
├── package.json
├── css/
│   ├── main.css            # Entry: imports all CSS modules
│   ├── base/
│   ├── components/
│   ├── sections/
│   ├── utilities/
│   └── responsive.css
├── js/
│   ├── main.js             # Entry: bootstraps app, lazy-loads sections
│   ├── state.js            # App state (current language)
│   ├── config.js           # App config (e.g. form endpoint)
│   ├── i18n/
│   │   └── strings.js      # UI strings (t, loadUiStrings, applyToDOM)
│   ├── utils/
│   │   ├── parse.js
│   │   └── contentLoader.js # loadContent with fallback to en
│   ├── navigation/
│   │   ├── tabs.js         # Tab switching, ARIA, onTabSwitch callback
│   │   └── lang.js         # EN/NL toggle
│   ├── sections/
│   │   ├── registry.js     # Section ids and loaders (single source of truth)
│   │   ├── hero.js
│   │   ├── about.js
│   │   ├── services.js
│   │   ├── contact.js
│   │   └── reviews.js
│   └── ui/
│       └── scrollReveal.js
├── content/
│   ├── en/
│   │   ├── ui.json         # Nav and form labels (EN)
│   │   └── *.txt
│   └── nl/
│       └── ui.json         # Nav and form labels (NL); add *.txt for full NL
└── images/
```

## Running locally

**With Vite (recommended):**

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. `http://localhost:5173`).

**Without Vite:** Use any static server so ES modules and `content/` are served correctly:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:3000` (or the port shown). Use `/js/main.js` from the project root (e.g. `http://localhost:3000/`).

## Build

```bash
npm run build
```

Output is in `dist/`. Content and images are copied; JS and CSS are bundled and hashed.

```bash
npm run preview   # Serve dist/ to check the build
```

## Formatting

The project uses [Prettier](https://prettier.io). Run before committing:

```bash
npm run format        # Format all files
npm run format:check # Check without writing
```

Config: `.prettierrc`; ignore list: `.prettierignore`.

## Config

- **Contact form:** Set `config.formEndpoint` in `js/config.js` to your form backend URL (e.g. Formspree) to send submissions. Leave empty to only log to console.

## i18n

- **UI strings:** Edit `content/en/ui.json` and `content/nl/ui.json` for nav labels, form labels, placeholders, and success message.
- **Page content:** Use `content/en/*.txt` and add `content/nl/*.txt` for Dutch. If a file is missing for the current language, the app falls back to `content/en/`.

## Adding a new section

1. Add a loader in `js/sections/` (e.g. `faq.js`).
2. Register it in `js/sections/registry.js`: add to `sectionLoaders` and `sectionOrder`.
3. Add the section block in `index.html` (tab panel + nav link with `data-tab="faq"` and `data-i18n="nav.faq"`).
4. Add `nav.faq` to `content/en/ui.json` and `content/nl/ui.json`.

## Legacy files

You can remove these after confirming everything works:

- `css/style.css`
- `js/app.js`
