// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://lifeandlemons.de',
  // Jede Seite wird als eigener Ordner mit index.html gebaut: /angebote/ statt /angebote.html
  build: { format: 'directory' },
  trailingSlash: 'ignore',
});
