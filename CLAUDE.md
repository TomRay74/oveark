# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Printable spelling practice worksheet generator for children. Vanilla HTML/CSS/JS — no build step, no npm, no dependencies (except Google Fonts CDN for the tracing font, and html2canvas + jsPDF loaded lazily for PDF export).

Live at: `https://reiertsen.com/oveark` (GitHub Pages)

## Running

Open `index.html` directly in a browser. No server needed.

## Architecture

Three files, no modules:

- **`index.html`** — structure only. All translatable strings carry `data-i18n="key"` attributes; `script.js` swaps their text on language change. Checkboxes use `change` events; inputs/selects use `input`.
- **`style.css`** — layout (flex sidebar + main), controls panel, sheet table, letter strip variants, responsive breakpoints, print rules. CSS custom property `--box-size` (set by JS) drives all letter-box sizing. `@media print` hides `.no-print` and sets `@page { size: A4 landscape }`.
- **`script.js`** — all logic. Key sections:
  - `TRANSLATIONS` object — all UI strings + `wordBank` arrays per language (`no`, `en`). Adding a language = one new key here + one `<option>` in HTML.
  - `applyLanguage()` — updates all `[data-i18n]` elements, placeholder, and default title/instruction if still at a known default.
  - `buildCoverPage()` / `buildSheet()` — pure string builders, return HTML injected into `#sheet`.
  - `saveState()` / `loadState()` — full settings persistence via `localStorage`. `loadState` wraps `JSON.parse` in try/catch and clears corrupt entries.
  - `savePDF()` — lazy-loads html2canvas + jsPDF from jsDelivr CDN on first call, captures each `.sheet-page` as a canvas and assembles an A4 landscape PDF. Wrapped in try/finally — button always re-enables; errors shown in button text for 3 s.

## Letter strip styles

Three style modes controlled by `$('style').value`:

| Value | Strip class | Element class | Border behaviour |
|-------|-------------|--------------|-----------------|
| `boxes` | `letter-strip` | `.letter-box` | All four borders; `border-right: none` on all-but-last (crossword flush) |
| `lines` | `letter-strip lines` | `.letter-line` | Bottom border only; `gap: 0.2cm` between letters |
| `bare` | `letter-strip bare` | `.letter-bare` | No borders; `gap: 0`; `width: auto` (shrinks to glyph width); `min-width: 0.55 × --box-size` keeps writing space when trace is off |

Trace mode (`$('trace').checked`) injects `<span class="trace-letter">` inside each element; font is `Patrick Hand` at `0.72 × --box-size`.

## i18n pattern

```js
// Read current translation
function t(key) {
  return TRANSLATIONS[$('lang').value]?.[key] ?? key;
}

// Apply to DOM
document.querySelectorAll('[data-i18n]').forEach(el => {
  el.textContent = t(el.dataset.i18n);
});
```

Sheet-side strings (column headers, cover subtitle) also go through `t()` inside `buildSheet()`. The `pdfError` key is used by `savePDF()` to display an inline error message.

## Language switching

The `lang` change listener calls `fillRandomWords()` only if the word list is empty or matches `lastRandomWords` (a module-level variable set every time `fillRandomWords()` runs). This means only lists explicitly generated via the Random button in the current session are replaced — user-typed or pasted words, and words restored from `localStorage`, are always preserved.

## State shape (localStorage)

```json
{
  "lang": "no",
  "title": "Øveark: Rettskriving",
  "instruction": "Skriv én bokstav i hver rute.",
  "columns": "3",
  "boxSize": "1.3",
  "style": "boxes",
  "caseMode": "lower",
  "wordCol": "full",
  "trace": false,
  "coverPage": false,
  "words": "bord\njord\nfjord"
}
```

## Responsive layout

- **> 680px**: flex row — sticky controls sidebar (280px) + scrollable sheet area
- **≤ 680px**: flex column — controls full-width on top, sheet below with `overflow-x: auto`
- **≤ 400px**: form grid switches to single column

## Versioning

Version number is derived at runtime from the GitHub commit count via the API — no version file to maintain. Formula: oldest commit = `v1.0.0`, commit N = `v1.0.(N-1)`.

- `initVersion()` in `script.js` fetches `https://api.github.com/repos/TomRay74/oveark/commits?per_page=1`, reads the `Link` header to get total commit count, and sets `#versionLink` text. Fetches live on every page load (no cache) so the number always matches the versions page. Fails silently (hides link) if offline or API unavailable.
- `versions/index.html` — standalone page at `/oveark/versions/`. Fetches all commits (`per_page=100`), assigns version numbers, displays newest-first with date and commit subject. Has a back link to the main app.

## Analytics

GoatCounter (anonymous, no cookies) loaded via `https://gc.zgo.at/count.js`. Stats at `https://tomray74.goatcounter.com`. A redirect page at `stat/index.html` sends visitors there from `/oveark/stat/`.

## Planned next: larger word banks

Current word banks (~80 words each) will be replaced or supplemented with larger static files (`words-no.txt`, `words-en.txt`) fetched from the repo, with graceful fallback to the built-in bank if fetch fails. See `oveark-generator-prosjekt.md` for details.
