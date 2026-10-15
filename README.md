# lifeandlemons.de

Website von Life&Lemons, gebaut mit [Astro](https://astro.build) als statische Seite und veröffentlicht über Netlify.

## Wo was steht

| Was | Datei |
| --- | --- |
| Preise, Plätze, Fristen, Ziel jedes Kauf- oder Anfragebuttons | `src/config/angebote.ts` |
| Name, Kontakt-E-Mail, Navigation, Schalter für Suchmaschinen | `src/config/site.ts` |
| Farben, Schriften, Abstände (vorläufig) | `src/styles/global.css` |
| Grundlayout mit Kopf- und Fußbereich | `src/layouts/Base.astro` |
| Seiten | `src/pages/` |
| Weiterleitungen und Sicherheits-Header | `netlify.toml` |

## Seiten und URLs

| URL | Datei |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/entwirf-dein-zukunfts-ich/` | `src/pages/entwirf-dein-zukunfts-ich.astro` |
| `/angebote/` | `src/pages/angebote.astro` |
| `/ueber-mich/` | `src/pages/ueber-mich.astro` |
| `/impressum/` | `src/pages/impressum.astro` |
| `/datenschutz/` | `src/pages/datenschutz.astro` |

Veröffentlichte URLs bleiben stabil. Muss eine URL sich ändern, kommt eine Weiterleitung in `netlify.toml`.

## Häufige Änderungen

**Kaufbutton auf Digistore24 umstellen:** In `src/config/angebote.ts` beim Angebot die `aktion` durch eine `checkout`-Aktion mit der Bestell-URL ersetzen. Ein Beispiel steht als Kommentar beim Kursbuch.

**Plattformwechsel zu ablefy:** Nur die `url` und den `anbieter` der `checkout`-Aktionen ändern.

**Einführungspreise:** Sie werden bis einschließlich `EINFUEHRUNG_BIS` angezeigt. Die Website ist statisch, deshalb muss sie nach diesem Datum einmal neu gebaut werden (in Netlify: „Trigger deploy“), damit die regulären Preise erscheinen.

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
- Kein Tracking, keine Cookies, Schriften lokal eingebunden.
- Keine eigene Zahlungsabwicklung. Bestellungen laufen über externe Anbieter.
- Preise, Leistungen und Termine nur aus bestätigten Angaben.
