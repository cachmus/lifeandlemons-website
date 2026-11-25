/**
 * Ratgeber: Themen und Artikel.
 * Artikel liegen als Markdown in src/ratgeber/<slug>.md und erscheinen unter /ratgeber/<slug>/.
 * Neues Thema: hier in `themen` ergänzen. Themen ohne Artikel werden auf der Übersicht nicht angezeigt.
 * Bilder: Aquarellmotive aus Christines Bestand (Game/Stil_Design_Bilder_Motive, Rechte bei Christine, bestätigt 16.11.2026).
 * Neuer Artikel: Aufmacher in src/assets/ratgeber/ ablegen und unten in `aufmacher` eintragen.
 */
import type { ImageMetadata } from 'astro';
import bildJahresrueckblick from '../assets/ratgeber/thema-jahresrueckblick.png';
import bildOrientierung from '../assets/ratgeber/thema-orientierung.jpg';
import bildDranbleiben from '../assets/ratgeber/thema-dranbleiben.jpg';
import aufmacherJahresrueckblick from '../assets/ratgeber/aufmacher-jahresrueckblick.jpg';
import aufmacherVergleich from '../assets/leben/weg-tal.jpg';

export const themen = [
  {
    id: 'jahresrueckblick',
    label: 'Jahresrückblick und Neuanfang',
    beschreibung: 'Wenn du dein Jahr abschließen und mit einem klaren Bild ins nächste gehen willst.',
    bild: bildJahresrueckblick,
    bildAlt: 'Aquarell eines Wandkalenders aus Papier mit Zitronenblüte',
  },
  {
    id: 'orientierung',
    label: 'Orientierung und Lebensziele',
    beschreibung: 'Wenn dein Leben funktioniert, sich aber nicht mehr ganz nach deinem eigenen anfühlt.',
    bild: bildOrientierung,
    bildAlt: 'Aquarell einer Terrasse mit Kompass und Globus über einem See',
  },
  {
    id: 'dranbleiben',
    label: 'Dranbleiben und Gewohnheiten',
    beschreibung: 'Wenn deine Vorhaben im Alltag immer wieder versanden.',
    bild: bildDranbleiben,
    bildAlt: 'Aquarell einer sonnigen Steintreppe zwischen Häusern mit Blumen',
  },
] as const;

/** Aufmacherbild je Artikel (Hochformat), Schlüssel = Dateiname des Artikels */
export const aufmacher: Record<string, { bild: ImageMetadata; alt: string }> = {
  'jahresrueckblick-fragen': {
    bild: aufmacherJahresrueckblick,
    alt: 'Aquarell eines Arbeitszimmers im Abendlicht mit Schreibtisch, Stuhl und offenem Fenster',
  },
  'selbstcoaching-vergleich': {
    bild: aufmacherVergleich,
    alt: 'Aquarell eines mediterranen Tals mit einem gewundenen Weg zwischen Olivenbäumen',
  },
};

export type ThemaId = (typeof themen)[number]['id'];

export interface Artikel {
  slug: string;
  titel: string;
  /** Kurzer Titel für Karten und Brotkrumen */
  kurztitel: string;
  /**
   * Optional: Titel im Browser-Tab und in Suchergebnissen, 16 bis 46 Zeichen (danach hängt das Layout „ · Life&Lemons“ an).
   * Ohne Angabe gilt `titel`, wenn er passt, sonst `kurztitel`.
   */
  seitentitel?: string;
  beschreibung: string;
  thema: ThemaId;
  /** Hauptsuchbegriff, nur zur Orientierung beim Schreiben */
  hauptbegriff: string;
  veroeffentlicht: string;
  aktualisiert?: string;
  lesezeit: number;
  kurz: string[];
  faq?: { frage: string; antwort: string }[];
  /**
   * Quellenliste am Ende des Artikels (Ratgeber-Leitfaden, 25.11.2026: Zahlen nur mit Studie, am Ende eine Quellenliste).
   * `titel` ist die vollständige Angabe (Autorinnen, Jahr, Titel, Zeitschrift), `url` der frei zugängliche Text, falls vorhanden.
   */
  quellen?: { titel: string; url?: string }[];
  /** Artikel aus anderen Themen, die unter „Weiterlesen“ zuerst erscheinen (Dateinamen ohne .md) */
  verwandt?: string[];
  /** true: Vergleichstabelle der Formate vor dem Text (Komponente FormateVergleich) */
  vergleich?: boolean;
  /** Eigene Überschrift und eigener Text der Journal-Karte, sonst der Text für den Jahresrückblick */
  journalKarte?: { titel: string; text: string };
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

/**
 * Bis zu drei Artikel für „Weiterlesen“: zuerst die unter `verwandt` genannten, dann weitere aus demselben Thema.
 * Ein Name unter `verwandt` ohne passenden Artikel bricht den Build ab, damit kein toter Verweis online geht.
 */
export function weiterlesenFuer(a: Artikel, anzahl = 3): Artikel[] {
  const genannt = (a.verwandt ?? []).map((slug) => {
    const treffer = artikel.find((x) => x.slug === slug);
    if (!treffer) throw new Error(`[Ratgeber] „${a.slug}“ nennt unter verwandt den Artikel „${slug}“, den es nicht gibt.`);
    return treffer;
  });
  const gleichesThema = artikel.filter((x) => x.thema === a.thema);
  const liste = [...genannt, ...gleichesThema].filter((x, i, alle) => x.slug !== a.slug && alle.findIndex((y) => y.slug === x.slug) === i);
  return liste.slice(0, anzahl);
}

/** Link zum Journal aus einem Artikel: Die Kampagnenangabe landet im Brevo-Feld QUELLE als „ratgeber/<slug>“ (JournalFormular). */
export const journalLinkAus = (slug: string, journalPfad: string) =>
  `${journalPfad}?utm_source=ratgeber&utm_medium=website&utm_campaign=${encodeURIComponent(slug)}`;

/** Erlaubte Länge des eigenen Teils im Seitentitel (Audit geo-audit c_title): gerendert mit „ · Life&Lemons“ 30 bis 60 Zeichen */
export const SEITENTITEL = { min: 16, max: 46 } as const;

const passt = (t?: string) => !!t && t.length >= SEITENTITEL.min && t.length <= SEITENTITEL.max;

/** Seitentitel eines Artikels: `seitentitel`, sonst `titel`, sonst `kurztitel`. Passt keiner, Warnung im Build statt stillem Kürzen. */
export function seitentitelVon(a: Artikel): string {
  const wahl = [a.seitentitel, a.titel, a.kurztitel].find(passt);
  if (!wahl) {
    console.warn(`\n[Ratgeber] Kein Seitentitel mit ${SEITENTITEL.min} bis ${SEITENTITEL.max} Zeichen für „${a.slug}“. Bitte \`seitentitel\` im Frontmatter setzen.`);
    return a.seitentitel ?? a.kurztitel;
  }
  return wahl;
}
