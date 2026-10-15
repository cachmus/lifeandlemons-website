/**
 * Alle Angebote mit Preisen, Plätzen und dem Ziel ihres Buttons.
 *
 * Quelle der Angaben: Kampagnenplan V8 und Projektstatus V2 vom 13.10.2026.
 * Preise, Plätze und Fristen nur hier ändern. Jeder Button auf der Website liest sein Ziel aus `aktion`.
 *
 * Plattformwechsel (z. B. Digistore24 → ablefy): nur die `url` in den betroffenen
 * `checkout`-Aktionen austauschen. Der übrige Code bleibt unverändert.
 */

import { anfrageLink } from './site';

/** Letzter Tag der Einführungspreise. Danach gilt `preisRegulaer`. */
export const EINFUEHRUNG_BIS = '2026-12-07';

export type Aktion =
  /** Externes Bestellformular, z. B. Digistore24 */
  | { typ: 'checkout'; anbieter: 'digistore24' | 'ablefy'; url: string; label: string }
  /** Anfrage per E-Mail mit vorbefülltem Betreff */
  | { typ: 'anfrage'; url: string; label: string }
  /** Eintrag auf eine Warteliste (bis zur Brevo-Anbindung per E-Mail) */
  | { typ: 'warteliste'; url: string; label: string };

export type Angebot = {
  id: string;
  name: string;
  kurz: string;
  /** Preis in Euro. null = kostenlos, undefined = kein Preis angegeben */
  preisEinfuehrung?: number | null;
  preisRegulaer?: number;
  plaetze?: string;
  termin?: string;
  besonderheit?: string;
  aktion: Aktion;
  /** Steuert die Reihenfolge und ob das Angebot in der Übersicht erscheint */
  sichtbar: boolean;
};

export const angebote: Angebot[] = [
  {
    id: 'kursbuch',
    name: 'Kursbuch „Entwirf dein Zukunfts-Ich“',
    // OFFEN: Seitenzahl bestätigen (Druck: 184 Innenseiten, Projektanweisung: 188, Broschüre: 186)
    kurz: 'Gedrucktes Workbook mit neun Einheiten zum selbstständigen Durcharbeiten.',
    preisEinfuehrung: 49,
    preisRegulaer: 59,
    // Bis zur Digistore24-Freigabe läuft die Bestellung per Anfrage.
    // Nach der Freigabe ersetzen durch:
    // { typ: 'checkout', anbieter: 'digistore24', url: 'https://www.checkout-ds24.com/product/XXXXX', label: 'Jetzt kaufen' }
    aktion: { typ: 'anfrage', url: anfrageLink('Bestellung Kursbuch'), label: 'Kursbuch bestellen' },
    sichtbar: true,
  },
  {
    id: 'erste-kohorte',
    name: 'Erste Kohorte des Life&Lemons Club',
    kurz: 'Drei Treffen im Wochenabstand, 14 Tage Probezeit und ein Abschluss-Call Mitte Dezember.',
    preisEinfuehrung: null,
    plaetze: 'höchstens 4',
    termin: 'Start in der Woche vom 9. bis 15.11.2026, Anmeldung bis 01.11.2026',
    aktion: { typ: 'anfrage', url: anfrageLink('Anmeldung erste Kohorte'), label: 'Platz anfragen' },
    sichtbar: true,
  },
  {
    id: 'einzel-track',
    name: 'Einzel-Track',
    kurz: '[Platzhalter: Leistungsbeschreibung aus Broschüre S. 7]',
    preisEinfuehrung: 249,
    preisRegulaer: 790,
    plaetze: '10',
    termin: 'Start spätestens 14.12.2026',
    aktion: { typ: 'anfrage', url: anfrageLink('Anfrage Einzel-Track'), label: 'Orientierungsgespräch anfragen' },
    sichtbar: true,
  },
  {
    id: 'club-gruppe',
    name: 'Life&Lemons Club, Gruppe',
    kurz: '[Platzhalter: Leistungsbeschreibung aus Broschüre S. 7]',
    preisEinfuehrung: 299,
    preisRegulaer: 890,
    plaetze: '6',
    termin: 'findet ab 2 Anmeldungen statt, Start spätestens 06.01.2027',
    aktion: { typ: 'anfrage', url: anfrageLink('Anfrage Club-Gruppe'), label: 'Orientierungsgespräch anfragen' },
    sichtbar: true,
  },
  {
    id: 'vip-track',
    name: 'VIP-Track',
    kurz: '[Platzhalter: Leistungsbeschreibung aus Broschüre S. 7]',
    preisEinfuehrung: 1900,
    preisRegulaer: 5900,
    plaetze: '3',
    termin: 'Start spätestens 14.12.2026',
    besonderheit: 'täglich per Messenger erreichbar',
    aktion: { typ: 'anfrage', url: anfrageLink('Anfrage VIP-Track'), label: 'Orientierungsgespräch anfragen' },
    sichtbar: true,
  },
  {
    id: 'selbstlernkurs',
    name: 'Selbstlernkurs mit Video',
    kurz: 'Videos zu den neun Einheiten. In Vorbereitung.',
    aktion: { typ: 'warteliste', url: anfrageLink('Warteliste Selbstlernkurs'), label: 'Auf die Warteliste' },
    sichtbar: true,
  },
];

export function angebotNachId(id: string): Angebot {
  const angebot = angebote.find((a) => a.id === id);
  if (!angebot) throw new Error(`Unbekanntes Angebot: ${id}`);
  return angebot;
}

/** Einführungspreise gelten bis einschließlich EINFUEHRUNG_BIS (Zeitpunkt des Builds). */
export function einfuehrungAktiv(heute: Date = new Date()): boolean {
  return heute <= new Date(`${EINFUEHRUNG_BIS}T23:59:59+01:00`);
}

export function formatEuro(betrag: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(betrag);
}

export function formatDatum(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}
