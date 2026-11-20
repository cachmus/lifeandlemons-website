/**
 * Kurzbeschreibung für KI-Assistenten unter /llms.txt (Audit heycatch, D5.5, 19.11.2026).
 * Format nach llmstxt.org: Titel, Kurzbeschreibung, Abschnitte mit Links.
 * Preise und Angebote kommen aus src/config/angebote.ts, damit hier nie ein veralteter Preis steht.
 */
import type { APIRoute } from 'astro';
import { site, seiten } from '../config/site';
import { angebotNachId, aktuellerPreis, formatEuro, formatDatum, STICHTAGE } from '../config/angebote';
import { artikel, artikelPfad } from '../config/ratgeber';

const adresse = (pfad: string) => new URL(pfad, site.url).href;

function preisText(id: string): string {
  const preis = aktuellerPreis(angebotNachId(id));
  if (!preis) return 'Preis auf Anfrage';
  return `${formatEuro(preis.betrag)}${preis.einfuehrung ? ` (Einführungspreis bis ${formatDatum(STICHTAGE.einfuehrungBis)})` : ''}`;
}

export const GET: APIRoute = () => {
  const app = angebotNachId('try-a-life');
  const workbook = angebotNachId('kursbuch');
  const zeilen = [
    `# ${site.name}`,
    '',
    `> Mentoring und Life Coaching für selbstbestimmte Lebensgestaltung von ${site.inhaberin}, ${site.rolle}, mit App und Workbook zum Selbstlernen. Mit ihrer Methode entwirfst du drei völlig unterschiedliche Leben und testest im Alltag, welcher Weg zu dir passt.`,
    '',
    'Alle Angebote sind auf Deutsch. Sie dienen der Selbstreflexion und ersetzen keine Psychotherapie.',
    '',
    '## Angebote',
    '',
    `- [Gratis-Journal „Wer will ich in 12 Monaten sein?“](${adresse(seiten.journal)}): kostenlos, PDF mit 17 Seiten, rund 90 Minuten. Jahresrückblick mit Ausblick und einem ersten Schritt.`,
    `- [Try a Life](${adresse(seiten.tryALife)}): Life-Coaching-App im Format eines Cozy Games, ${preisText('try-a-life')} inkl. MwSt., Kauf über Digistore24. Enthält ${app.enthaelt} Kostenlose Demo ohne Anmeldung: ${app.demo?.url ?? ''}`,
    `- [Workbook „Entwirf dein Zukunfts-Ich“](${adresse(seiten.modul1)}): ${preisText('kursbuch')} inkl. Versand, Bestellung direkt bei ${site.inhaberin}. Enthält ${workbook.enthaelt}`,
    `- [Alle Angebote im Überblick](${adresse(seiten.angebote)})`,
    '',
    '## Methode und Person',
    '',
    `- [Wie ich arbeite](${adresse(seiten.wieIchArbeite)}): sieben Phasen, wissenschaftliche Grundlagen und Grenzen der Methode`,
    `- [Über mich](${adresse(seiten.ueberMich)}): ${site.inhaberin}, ${site.rolle}`,
    '',
    '## Ratgeber',
    '',
    ...artikel.map((a) => `- [${a.titel}](${adresse(artikelPfad(a.slug))}): ${a.beschreibung}`),
    '',
    '## Kontakt',
    '',
    `- E-Mail: ${site.kontaktEmail}`,
    `- Instagram: ${site.instagram.url}`,
    '',
  ];
  return new Response(zeilen.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
