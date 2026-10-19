# lifeandlemons.de

Website von Life&Lemons, gebaut mit [Astro](https://astro.build) als statische Seite und veröffentlicht über Netlify.

## Wo was steht

| Was | Datei |
| --- | --- |
| Preise, Fristen, Plätze, Ziel jedes Kauf- oder Anmeldebuttons | `src/config/angebote.ts` |
| Name, Kontakt, Navigation, Interessentenliste (Brevo), Schalter für Suchmaschinen | `src/config/site.ts` |
| Farben, Schriften, Abstände, Buttons | `src/styles/global.css` |
| Kopfzeile, Footer, Seitenrahmen | `src/layouts/Base.astro` |
| Bausteine (Treppe, Modulkarte, Formatkarte, Polaroid, Interessentenliste, Preis) | `src/components/` |
| Bewegung (Erscheinen beim Scrollen, Kopfzeile) | `src/scripts/bewegung.ts` |
| Bilder (werden beim Bauen als WebP/AVIF ausgegeben) | `src/assets/` |
| Seiten | `src/pages/` |
| Kurzlinks, Weiterleitungen, Sicherheits-Header | `netlify.toml` |
| Nächtlicher Neuaufbau für Datumsumstellungen | `.github/workflows/naechtlicher-build.yml` |

Inhaltliche Grundlage sind vier Dokumente im claude.ai-Projekt „Life&Lemons Website“: `Leitplanken_Website.md`, `Website_Entscheidungen.md`, `Gestaltung_Website.md`, `Texte_Startseite.md`, dazu `Texte_Unterseiten.md` für die übrigen Seiten.

## Seiten und URLs

| URL | Datei |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/programme/entwirf-dein-zukunfts-ich/` (Anker `#kursbuch`, `#club`, `#formate`) | `src/pages/programme/entwirf-dein-zukunfts-ich.astro` |
| `/programme/manifestiere-dein-zukunfts-ich/` | `src/pages/programme/manifestiere-dein-zukunfts-ich.astro` |
| `/ueber-mich/` | `src/pages/ueber-mich.astro` |
| `/impressum/`, `/datenschutz/` | `src/pages/impressum.astro`, `src/pages/datenschutz.astro` |
| `/buch` → Kursbuch, `/club` → Club | Kurzlinks in `netlify.toml` |

Veröffentlichte URLs bleiben stabil. Muss eine URL sich ändern, kommt eine Weiterleitung in `netlify.toml`.

## Häufige Änderungen

**Digistore24-Bestellformulare eintragen:** In `src/config/angebote.ts` bei `DIGISTORE24` die Bestelladressen für Kursbuch, Club, Einzel-Track und VIP-Track eintragen. Solange eine Adresse fehlt, zeigt die Vorschau eine Bestellung per E-Mail. Sobald `indexierbar` auf `true` steht, bricht der Build ohne vollständige Adressen ab, damit keine E-Mail-Bestellung online geht.

**Vorbestellung und Lieferzeit:** Der Hinweis beim Kursbuch steht in `lieferhinweis` („Jetzt vorbestellen: normalerweise versandfertig innerhalb von 7 Tagen.“). Mit Lagerbestand dort ändern. Die Hinweise zum Kursstart der begleiteten Formate stehen in `startHinweis`.

**Plattformwechsel zu ablefy:** Die Adressen in `DIGISTORE24` austauschen und in `checkoutOderAnfrage` den Anbieter ändern.

**Preise und Fristen:** Bis `STICHTAGE.einfuehrungBis` erscheinen die Einführungspreise. Danach erscheint der reguläre Preis nur, wenn `preisRegulaerBestaetigt: true` gesetzt ist, sonst gar kein Preis (das Build-Protokoll weist darauf hin). Nach `buchbarBis` oder mit `ausgebucht: true` pausiert ein Angebot und der Button führt zur Interessentenliste.

**Datumsumstellungen pünktlich:** Die Seite ist statisch und rechnet Daten beim Bauen aus. Der GitHub-Ablauf `naechtlicher-build.yml` löst jede Nacht einen Netlify-Build aus. Einrichtung steht oben in der Datei. Testen lässt sich ein Stichtag lokal mit `STICHTAG_TEST=2026-12-08 npm run build`.

**Interessentenliste (Brevo):** Anleitung in `src/config/site.ts` bei `newsletter`. Solange keine Formularadresse eingetragen ist, öffnet das Formular eine vorbereitete E-Mail.

**Livegang:** In `src/config/site.ts` `indexierbar` auf `true` setzen, sobald Impressum und Datenschutz geprüft sind.

## Lokal starten (optional)

Voraussetzung: Node.js 22.12 oder neuer.

```sh
npm install
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # Typprüfung und Produktions-Build nach dist/
```

## Grundsätze

- Keine API-Schlüssel oder Zugangsdaten im Repository. Das Repository ist öffentlich.
- Kein Tracking, keine Cookies, Schriften lokal eingebunden (Fontsource).
- Keine eigene Zahlungsabwicklung. Bestellungen laufen über externe Anbieter.
- Preise, Leistungen und Termine nur aus bestätigten Angaben.
