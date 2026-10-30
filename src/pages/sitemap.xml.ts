/**
 * Sitemap für Suchmaschinen unter /sitemap.xml.
 * Enthält jede Seite aus src/pages automatisch, außer den Adressen in `ohneSuche` (src/config/site.ts).
 * In der Google Search Console einmal einreichen; danach liest Google sie selbst neu ein.
 */
import type { APIRoute } from 'astro';
import { site, inDerSuche } from '../config/site';

const dateien = Object.keys(import.meta.glob('./**/*.astro'));

/** ./ueber-mich.astro → /ueber-mich/, ./index.astro → / */
function pfadAus(datei: string): string {
  const ohneEndung = datei.replace(/^\.\//, '').replace(/\.astro$/, '');
  const pfad = ohneEndung === 'index' ? '' : ohneEndung.replace(/\/index$/, '');
  return pfad ? `/${pfad}/` : '/';
}

export const GET: APIRoute = () => {
  const adressen = site.indexierbar
    ? dateien
        .filter((datei) => !datei.includes('['))
        .map(pfadAus)
        .filter(inDerSuche)
        .sort()
    : [];

  const eintraege = adressen.map((pfad) => `  <url><loc>${new URL(pfad, site.url).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${eintraege}\n</urlset>\n`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
