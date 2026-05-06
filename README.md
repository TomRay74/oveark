# Øveark-generator for rettskriving

Lokal webapp for å lage utskriftsvennlige rettskrivingsark til barn. Ingen installasjon.

Live: [reiertsen.com/oveark](https://reiertsen.com/oveark)

## Bruk

Åpne `index.html` i en nettleser (dobbeltklikk eller dra inn i nettleser-vinduet).

1. Lim inn ordliste — ett ord per linje
2. Velg antall øvingskolonner (1–6) og boksstørrelse
3. Arket oppdateres automatisk mens du skriver
4. Klikk **Skriv ut** — skrives ut på A4 liggende, kun arket vises

Se [bruksguide](usage/index.html) for full dokumentasjon av alle funksjoner.

## Del forhåndskonfigurert ark via URL

Bruk `?`-parametere for å dele et ark med ferdig innstillinger:

```
index.html?w=katt,hund,fugl&style=lines&columns=4
```

| Parameter | Verdier |
|-----------|---------|
| `w` | ord, kommaseparert |
| `lang` | `no` eller `en` |
| `style` | `boxes`, `lines`, `bare` |
| `columns` | 1–6 |
| `boxSize` | størrelse i cm |
| `trace` | `1` eller `0` |
| `title` | tekst |

## Kjente begrensninger

- Tittelen gjentas ikke automatisk ved sideskift (kolonneoverskriftene gjør det)
- Veldig lange ord (10+ bokstaver) kan kreve mindre boksstørrelse eller færre kolonner
