# Research site PWA

The research site is a mobile-first progressive web app served from `docs/` on GitHub Pages. It includes a relative `manifest.webmanifest`, standalone display metadata, theme/background colors, PNG icons (including a maskable 512px icon), and a same-origin service worker. The install control appears only when the browser exposes `beforeinstallprompt`.

Supported locales are English (`en`), Simplified Chinese (`zh-CN`), and Traditional Chinese (`zh-TW`). Locale resolution is query string (`?lang=`), then `localStorage`, then the browser language list, and finally English. Chinese browser tags map as follows: `zh`, `zh-CN`, and Hans variants to `zh-CN`; `zh-TW`, `zh-HK`, and Hant variants to `zh-TW`.

The service worker version-precaches both `index.html` and `tcm.html` plus CSS, JavaScript, manifest, summary data, locale files, and icons. Same-origin GET requests use the cache when available; offline navigation to the TCM route falls back to cached `tcm.html`, other navigation falls back to cached `index.html`, and old cache versions are removed on activation. External GitHub artifact links are intentionally never cached.

All app URLs use `./`-relative paths so the site works under a GitHub Pages project path such as `/agent-prompt-research/`; artifact links remain absolute GitHub URLs.

Install prompts are not universal, and browser/platform support varies. This site does not claim a Lighthouse score or guarantee installation on every browser.
