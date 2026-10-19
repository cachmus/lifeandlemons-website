// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Hauptadresse mit www (entschieden 19.10.2026); lifeandlemons.de leitet bei Netlify darauf weiter
  site: 'https://www.lifeandlemons.de',
  // Jede Seite wird als eigener Ordner mit index.html gebaut: /angebote/ statt /angebote.html
  build: { format: 'directory' },
  trailingSlash: 'ignore',
});
