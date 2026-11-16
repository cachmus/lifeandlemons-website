/**
 * Ratgeber: Themen und Artikel.
 * Artikel liegen als Markdown in src/ratgeber/<slug>.md und erscheinen unter /ratgeber/<slug>/.
 * Neues Thema: hier in `themen` ergänzen. Themen ohne Artikel werden auf der Übersicht nicht angezeigt.
 */

export const themen = [
  {
    id: 'jahresrueckblick',
    label: 'Jahresrückblick und Neuanfang',
    beschreibung: 'Wenn du dein Jahr abschließen und mit einem klaren Bild ins nächste gehen willst.',
  },
  {
    id: 'orientierung',
    label: 'Orientierung und Lebensziele',
    beschreibung: 'Wenn dein Leben funktioniert, sich aber nicht mehr ganz nach deinem eigenen anfühlt.',
  },
  {
    id: 'dranbleiben',
    label: 'Dranbleiben und Gewohnheiten',
    beschreibung: 'Wenn deine Vorhaben im Alltag immer wieder versanden.',
  },
] as const;

export type ThemaId = (typeof themen)[number]['id'];

export interface Artikel {
  slug: string;
  titel: string;
  /** Kurzer Titel für Karten und Brotkrumen */
  kurztitel: string;
  beschreibung: string;
  thema: ThemaId;
  /** Hauptsuchbegriff, nur zur Orientierung beim Schreiben */
  hauptbegriff: string;
  veroeffentlicht: string;
  aktualisiert?: string;
  lesezeit: number;
  kurz: string[];
  faq?: { frage: string; antwort: string }[];
}

type Modul = { frontmatter: Omit<Artikel, 'slug'>; Content: unknown; getHeadings: () => { depth: number; slug: string; text: string }[] };

const module = import.meta.glob<Modul>('../ratgeber/*.md', { eager: true });

export const artikelModule = Object.entries(module).map(([datei, modul]) => ({
  slug: datei.split('/').pop()!.replace(/\.md$/, ''),
  modul,
}));

export const artikel: Artikel[] = artikelModule
  .map(({ slug, modul }) => ({ slug, ...modul.frontmatter }))
  .sort((a, b) => (b.veroeffentlicht > a.veroeffentlicht ? 1 : -1));

export const artikelPfad = (slug: string) => `/ratgeber/${slug}/`;
