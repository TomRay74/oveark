# Prosjekt: Øveark-generator for rettskriving

## Formål
Lokal webapp hvor brukeren skriver inn ord og får generert et trykkvennlig øveark. Ordene listes nedover på venstre side, og hver rad har N øvingskolonner med bokstavfelt (én boks per bokstav) som barnet fyller ut. Erstatter manuelt arbeid i Google Docs.

Publisert på: [reiertsen.com/oveark](https://reiertsen.com/oveark)
GitHub: [github.com/TomRay74/oveark](https://github.com/TomRay74/oveark)

---

## Levert funksjonalitet

### Input-panel
- Tittel og instruksjonstekst (redigerbare, med fornuftige standardverdier per språk)
- Antall øvingskolonner (1–6, default 3)
- Boksstørrelse i cm (0.8–2.0, default 1.3)
- **Stil** — tre varianter:
  - *Bokser*: kryssord-stil med delte kantlinjer (ingen mellomrom)
  - *Understrek*: én bunnlinje per bokstav
  - *Bare bokstaver*: ingen boks/strek, kun grå bokstav
- **Bokstavform** — små / STORE / Forbokstav stor
- **Ord-kolonne** — vis fullt ord / første bokstav (B…) / skjul (viser radnummer som matcher forsiden)
- **Sporingsbokstaver** — vis lysegrå Patrick Hand-bokstaver å spore over (fungerer for alle stiler)
- **Forside** — valgfri forside med nummerert ordliste i 2 kolonner, sideskift ved utskrift/PDF
- **Ordliste** med knapper:
  - *Tilfeldig* — 8 tilfeldige ord fra innebygd ordbank (~80 ord per språk)
  - *Lim inn* — henter fra utklippstavle (Clipboard API)
  - *Tøm* — nullstiller feltet
- **Språkvelger** (Norsk / English) — oversetter hele UI og arket, bytter ordbank og standardverdier automatisk

### Output / ark
- Live-forhåndsvisning — oppdateres uten knappetrykk
- Forside + øveark som separate sider
- Tabell: ord-kolonne (full / hint / radnummer) + N øvingskolonner
- Bokstavstriper i kryssord-stil (delte kantlinjer)
- Sporingsbokstaver i `Patrick Hand`-font (#c8c8c8)
- Kolonneoverskrifter gjentas ved sideskift (`<thead>`)

### Eksport
- **Lagre som PDF** — html2canvas + jsPDF lastet lazy fra CDN ved første klikk (~650 kb). Hvert `.sheet-page`-element blir én PDF-side på A4 liggende. Filnavnet hentes fra tittelen.
- **Skriv ut** — `window.print()`, A4 liggende via `@page`

### Responsivt design
- Under 680px: layout stacker vertikalt (kontrollpanel øverst, ark nedenfor)
- Under 400px: skjemafelt i én kolonne
- Ark-området scroller horisontalt om innholdet er bredere enn skjermen

### Persistens
- Alle innstillinger og ordliste lagres i `localStorage`, overlever sideoppdatering

---

## Teknisk stack

- **Vanilla HTML + CSS + JavaScript** — ingen byggsteg, ingen npm
- **Google Fonts CDN** — `Patrick Hand` for sporingsbokstaver (lastet i `<head>`)
- **html2canvas + jsPDF** — lastet lazy fra jsDelivr CDN kun ved PDF-eksport
- Filstruktur: `index.html`, `style.css`, `script.js`
- Åpnes direkte i nettleser (dobbeltklikk på `index.html`)
- Publisert via GitHub Pages

---

## Internasjonalisering (i18n)

`TRANSLATIONS`-objekt i `script.js` med nøkler for alle UI-strenger og ark-strenger. Støtter nå:
- `no` — Norsk
- `en` — English

Å legge til nytt språk (f.eks. Spansk, Tysk): legg til én nøkkel i `TRANSLATIONS` med alle strenger + `wordBank`-array, og én `<option>` i HTML.

---

## Neste iterasjon (planlagt)

### Større ordbanker
Innebygde ordbanker (~80 ord per språk) gir begrenset variasjon. Plan:

**Anbefalt: Statiske filer med offline-fallback**
Hoste `words-no.txt`, `words-en.txt` o.l. i repoet. Lastes med `fetch()` ved oppstart eller ved første klikk på *Tilfeldig*. Faller tilbake til innebygd bank hvis fetch feiler (offline / nettverksfeil).

**Alternativ: Eksternt API**
Vercel/Cloudflare Worker-endepunkt for ubegrenset, filtrerbart ordforråd (lengde, nivå). Krever backend-drift.

---

## Akseptansekriterier (opprinnelige — alle oppfylt)

- ✅ 8 ord (varierende lengde) → arket vises korrekt
- ✅ «fjord» (5 bokstaver) → 5 sammenhengende bokser
- ✅ Endring av kolonner → arket regenereres
- ✅ Ctrl+P viser kun arket
- ✅ A4 landscape, ren utskrift
- ✅ Norske tegn (æøå) fungerer

## Kjente begrensninger

- Tittelen gjentas ikke ved sideskift i utskrift (kolonneoverskriftene gjør det)
- PDF-eksport er bildebasert (html2canvas) — tekst er ikke søkbar/kopierbar i PDFen
- Veldig lange ord (10+ bokstaver) kan kreve mindre boksstørrelse eller færre kolonner
