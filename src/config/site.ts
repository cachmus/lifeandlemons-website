/**
 * Zentrale Angaben zur Website.
 * Navigation, Kontakt und Schalter für den Livegang stehen hier, nicht verteilt im Code.
 */

export const site = {
  name: 'Life&Lemons',
  url: 'https://lifeandlemons.de',
  inhaberin: 'Christine Achmus',
  rolle: 'Mentorin für Lebensentwürfe',
  kontaktEmail: 'christine@lifeandlemons.de',
  instagram: 'https://www.instagram.com/christine_neurowerk/',
  /**
   * Solange false, tragen alle Seiten "noindex". Vor dem Livegang auf true setzen,
   * sobald Impressum und Datenschutz geprüft sind.
   */
  indexierbar: false,
} as const;

export type NavPunkt = { label: string; href: string };

export const hauptnavigation: NavPunkt[] = [
  { label: 'Programm', href: '/entwirf-dein-zukunfts-ich/' },
  { label: 'Angebote', href: '/angebote/' },
  { label: 'Über mich', href: '/ueber-mich/' },
];

export const fussnavigation: NavPunkt[] = [
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
];

/** Baut einen mailto-Link mit vorbefülltem Betreff. */
export function anfrageLink(betreff: string): string {
  return `mailto:${site.kontaktEmail}?subject=${encodeURIComponent(betreff)}`;
}
