# Prosjekt: Øveark-generator for rettskriving

## Formål
Lokal webapp hvor brukeren skriver inn ord og får generert et trykkvennlig øveark. Ordene listes nedover på venstre side, og hver rad har N øvingskolonner med bokstavfelt (én boks per bokstav) som barnet fyller ut. Erstatter manuelt arbeid i Google Docs.

Publisert på: [reiertsen.com/oveark](https://reiertsen.com/oveark)
GitHub: [github.com/TomRay74/oveark](https://github.com/TomRay74/oveark)

---

## Levert funksjonalitet

### Input-panel
- Tittel og instruksjonstekst (redigerbare, med fornuftige standardverdier)
- Antall øvingskolonner (1–6, default 3)
- Boksstørrelse i cm (0.8–2.0, default 1.3)
- **Stil** — tre varianter:
  - *Bokser*: kryssord-stil, delte kantlinjer
  - *Understrek*: én bunnlinje per bokstav
  - *Bare bokstaver*: ingen boks/strek, kun bokstav
- **Bokstavform** — små / STORE / Forbokstav stor
- **Ord-kolonne** — vis fullt ord / første bokstav (B…) / skjul (viser radnummer)
- **Sporingsbokstaver** — vis lysegrå Patrick Hand-bokstaver til å spore over
- **Forside** — legg til forside med nummerert ordliste (2 kolonner) før øvearket
- **Ordliste** med knapper: *Tilfeldig* (8 tilfeldige ord fra ordbank) / *Lim inn* (clipboard) / *Tøm*
- **Språkvelger** (Norsk / English) — oversetter hele UI og arket, bytter ordbank automatisk

### Output / ark
- Live-forhåndsvisning — arket oppdateres uten knappetrykk
- Forside med ordlisten (valgfri), sideskift ved utskrift
- Øveark med tabell: ord-kolonne + N øvingskolonner
- Bokstav-striper i kryssord-stil (delte kantlinjer, ingen mellomrom)
- Sporingsbokstaver i `Patrick Hand`-font (#c8c8c8)
- Kolonneoverskrifter gjentas automatisk ved sideskift (thead)
- A4 liggende utskrift via `@page { size: A4 landscape; }`
- Skjema og knapper skjules ved utskrift (`@media print`)

### Persistens
- Alle innstillinger og ordliste lagres i `localStorage`, overlever sideoppdatering

---

## Teknisk stack

- **Vanilla HTML + CSS + JavaScript** — ingen byggsteg, ingen npm, ingen avhengigheter
- **Google Fonts CDN** — `Patrick Hand` for sporingsbokstaver
- Filstruktur: `index.html`, `style.css`, `script.js`
- Åpnes direkte i nettleser (dobbeltklikk på `index.html`)
- Publisert via GitHub Pages

---

## Internasjonalisering (i18n)

`TRANSLATIONS`-objekt i `script.js` med nøkler for alle UI-strenger. Støtter nå:
- `no` — Norsk
- `en` — English

Å legge til nytt språk: legg til én nøkkel i `TRANSLATIONS` og én `<option>` i HTML.
Hvert språk har også en `wordBank`-array (~80 vanlige ord) for tilfeldig-knappen.

---

## Neste iterasjon (planlagt)

### Større ordbanker
80 ord per språk er for lite for god variasjon. Alternativene:

**Alternativ A — Statiske filer på GitHub**
Hoste `words-no.txt`, `words-en.txt` o.l. i repoet. Lastes med `fetch()` ved oppstart
eller ved første klikk på *Tilfeldig*. Fordel: enkelt, ingen backend. Ulempe: krever
internettforbindelse (app fungerer i dag offline).

**Alternativ B — Eksternt API**
Spørre et API-endepunkt for N tilfeldige ord på gitt språk (f.eks. et enkelt Vercel/
Cloudflare Worker-endepunkt). Fordel: ubegrenset ordforråd, kan filtrere på lengde/
nivå. Ulempe: krever backend-drift.

**Anbefalt tilnærming:** Statiske filer (A) med graceful fallback til innebygd ordbank
hvis fetch feiler. Gir stor forbedring uten infrastruktur-overhead.

---

## Akseptansekriterier (opprinnelige — alle oppfylt)

- ✅ 8 ord (varierende lengde) → arket vises korrekt
- ✅ «fjord» (5 bokstaver) → 5 sammenhengende bokser
- ✅ Endring av kolonner → arket regenereres
- ✅ Ctrl+P viser kun arket
- ✅ A4 landscape, ren utskrift
- ✅ Norske tegn (æøå) fungerer

---

## Kjente begrensninger

- Tittelen gjentas ikke ved sideskift (kolonneoverskriftene gjør det)
- Veldig lange ord (10+ bokstaver) kan kreve mindre boksstørrelse eller færre kolonner
