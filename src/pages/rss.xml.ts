/**
 * RSS-Feed des Ratgebers unter /rss.xml (23.11.2026, für das automatische Veröffentlichen auf Pinterest).
 * Pinterest liest den Feed einmal am Tag und macht aus jedem neuen Artikel einen Pin. Dafür braucht jeder Eintrag
 * ein Bild: Das Aufmacherbild aus src/config/ratgeber.ts wird als JPG im Hochformat ausgeliefert (1000 px breit).
 * Ohne zusätzliches Paket gebaut (Hinweis in CLAUDE.md zu neuen Abhängigkeiten).
 */
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { site } from '../config/site';
import { artikel, artikelPfad, aufmacher } from '../config/ratgeber';

const adresse = (pfad: string) => new URL(pfad, site.url).href;

/** Sonderzeichen für XML maskieren */
const xml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** Datum im Format von RFC 822, wie RSS es verlangt; Artikel gelten ab 8 Uhr deutscher Zeit */
const rssDatum = (iso: string) => new Date(`${iso}T08:00:00+01:00`).toUTCString();

export const GET: APIRoute = async () => {
  const eintraege = await Promise.all(
    artikel.map(async (a) => {
      const link = adresse(artikelPfad(a.slug));
      const bild = aufmacher[a.slug];
      let bildZeile = '';
      if (bild) {
        const jpg = await getImage({ src: bild.bild, width: 1000, format: 'jpg' });
        const bildAdresse = adresse(jpg.src);
        bildZeile = [
          `      <media:content url="${xml(bildAdresse)}" medium="image" type="image/jpeg">`,
          `        <media:description>${xml(bild.alt)}</media:description>`,
          '      </media:content>',
        ].join('\n');
      }
      return [
        '    <item>',
        `      <title>${xml(a.titel)}</title>`,
        `      <link>${xml(link)}</link>`,
        `      <guid isPermaLink="true">${xml(link)}</guid>`,
        `      <description>${xml(a.beschreibung)}</description>`,
        `      <pubDate>${rssDatum(a.veroeffentlicht)}</pubDate>`,
        bildZeile,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    }),
  );

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.name} · Ratgeber`)}</title>
    <link>${xml(adresse('/ratgeber/'))}</link>
    <description>Artikel zu Jahresrückblick, Orientierung, Lebenszielen und Dranbleiben von ${xml(site.inhaberin)}.</description>
    <language>de-DE</language>
    <atom:link href="${xml(adresse('/rss.xml'))}" rel="self" type="application/rss+xml" />
${eintraege.join('\n')}
  </channel>
</rss>
`;

  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
