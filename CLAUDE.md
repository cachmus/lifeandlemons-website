# Hinweise für die Arbeit mit KI an diesem Repository

- Sprache der Inhalte und Kommentare: Deutsch. Code-Bezeichner dürfen deutsch sein, URLs ohne Umlaute.
- Statische Astro-Seite, kein Backend, keine Datenbank. Neue Abhängigkeiten nur mit gutem Grund.
- Preise, Plätze, Fristen und Button-Ziele ausschließlich in `src/config/angebote.ts`. Buttons nie mit fest eingetragener URL bauen, immer über `AngebotButton`.
- Kontakt-E-Mail und Navigation nur in `src/config/site.ts`.
- Das Repository ist öffentlich: keine Zugangsdaten, keine API-Schlüssel, keine personenbezogenen Daten von Kundinnen.
- Kein Tracking, keine externen Schriften oder Skripte ohne ausdrückliche Entscheidung.
- Inhalte nicht erfinden: keine Preise, Leistungen, Kundenstimmen oder Erfolgszahlen ohne Bestätigung. Fehlende Texte als `Platzhalter` mit Quelle kennzeichnen.
- Texte: keine Em-Dashes, keine Konstruktionen nach dem Muster „nicht X, sondern Y“, keine Marketingfloskeln.
- Rechtstexte immer als „fachlich zu prüfen“ kennzeichnen.
- Vor dem Commit `npm run build` ausführen; nur als erfolgreich melden, was tatsächlich gelaufen ist.
