/**
 * Hinweise für Suchmaschinen unter /robots.txt.
 * Alle Seiten dürfen gelesen werden. Was nicht in der Suche erscheinen soll (Danke-Seiten, 404),
 * trägt dort selbst "noindex"; eine Sperre hier würde verhindern, dass Suchmaschinen das sehen.
 */
import type { APIRoute } from 'astro';
import { site } from '../config/site';

export const GET: APIRoute = () => {
  const zeilen = ['User-agent: *', 'Allow: /'];
  if (site.indexierbar) zeilen.push('', `Sitemap: ${new URL('/sitemap.xml', site.url).href}`);
  return new Response(`${zeilen.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
