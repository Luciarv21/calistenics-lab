# Calisthenics Skill Lab Amsterdam

A simple, modular website for a calisthenics coach.

## Project structure

```
├── index.html              # Single page shell (nav, sections, footer)
├── css/
│   ├── main.css            # Entry: imports all CSS modules
│   ├── base/               # Variables, reset, layout
│   │   ├── variables.css
│   │   └── reset.css
│   ├── components/         # Reusable UI (navbar, buttons, footer)
│   │   ├── navbar.css
│   │   ├── buttons.css
│   │   └── footer.css
│   ├── sections/           # Page sections (hero, welcome, about, etc.)
│   │   ├── hero.css
│   │   ├── welcome.css
│   │   ├── tabs.css
│   │   ├── about.css
│   │   ├── services.css
│   │   ├── contact.css
│   │   └── reviews.css
│   ├── utilities/
│   │   └── scroll-reveal.css
│   └── responsive.css      # Global responsive overrides
├── js/
│   ├── main.js             # Entry: bootstraps app (ES module)
│   ├── state.js            # App state (e.g. current language)
│   ├── utils/
│   │   ├── parse.js        # parseKeyValue, parseSections
│   │   └── contentLoader.js # loadContent(lang/file)
│   ├── navigation/
│   │   ├── tabs.js         # Tab switching, mobile nav
│   │   └── lang.js         # EN/NL toggle
│   ├── sections/           # Section content loaders & renderers
│   │   ├── hero.js
│   │   ├── about.js
│   │   ├── services.js
│   │   ├── contact.js
│   │   └── reviews.js
│   └── ui/
│       └── scrollReveal.js
├── content/                # Text content per language
│   └── en/
│       └── *.txt
└── images/
```

## Running locally

The app uses **ES modules** (`type="module"`). Open the site over HTTP (not `file://`) so modules load correctly:

```bash
# From project root, e.g.:
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:3000` (or the port shown).

## Legacy files

After confirming everything works, you can remove the old single-file assets:

- `css/style.css` (replaced by `css/main.css` + modules)
- `js/app.js` (replaced by `js/main.js` + modules)
