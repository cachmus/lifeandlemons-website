/**
 * Alle Angebote mit Preisen, Fristen, Plätzen und dem Ziel ihres Buttons.
 *
 * Quellen: Broschüre „Entwirf dein Zukunfts-Ich“ (mobil, Version 02), Projektstatus V2,
 * claude/Website_Entscheidungen.md (Stand 16.10.2026).
 * Preise, Fristen und Button-Ziele nur hier ändern. Jeder Button liest sein Ziel aus `aktion`.
 *
 * Umstellungen nach Datum passieren beim Bauen der Website. Damit sie pünktlich erscheinen,
 * baut ein geplanter Ablauf die Seite jede Nacht neu (.github/workflows/naechtlicher-build.yml).
 *
 * Plattformwechsel (z. B. Digistore24 → ablefy): nur `url` und `anbieter` in den
 * `checkout`-Aktionen austauschen. Der übrige Code bleibt unverändert.
 */

import { anfrageLink, seiten } from './site';

// ---------------------------------------------------------------------------
// Stichtage (Datum im Format JJJJ-MM-TT, Zeitzone Europe/Berlin)
// ---------------------------------------------------------------------------

export const STICHTAGE = {
  /** Letzter Tag der Einführungspreise (per Broschüre veröffentlicht, steht fest) */
  einfuehrungBis: '2026-12-07',
  /** Winterpause: keine Kurszeit, keine Bearbeitung von Buchungen */
  winterpauseVon: '2026-12-23',
  winterpauseBis: '2027-01-04',
  /** Bis dahin ist alle Begleitung der ersten Runde abgeschlossen */
  begleitungEndet: '2027-02-05',
} as const;

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type Aktion =
  /** Externes Bestellformular, z. B. Digistore24 */
  | { typ: 'checkout'; anbieter: 'digistore24' | 'ablefy'; url: string; label: string }
  /** Anmeldung oder Bestellung per E-Mail mit vorbefülltem Betreff */
  | { typ: 'anfrage'; url: string; label: string }
  /** Eintrag in die Interessentenliste */
  | { typ: 'liste'; url: string; label: string };

export type Angebot = {
  id: string;
  /** 1 = Entwirf dein Zukunfts-Ich, 2 = Manifestiere dein Zukunfts-Ich */
  modul: 1 | 2;
  name: string;
  /** Kurzes Label über dem Namen, z. B. „Selbstständig“ */
  art: string;
  fuerDich: string;
  enthaelt: string;
  /** Einführungspreis in Euro, gilt bis STICHTAGE.einfuehrungBis */
  preisEinfuehrung?: number;
  /** Regulärer Preis in Euro ab dem Tag nach STICHTAGE.einfuehrungBis */
  preisRegulaer?: number;
  /** Erst wenn true, wird der reguläre Preis angezeigt */
  preisRegulaerBestaetigt: boolean;
  /** Spätester Buchungstag. Danach führt der Button zur Interessentenliste. */
  buchbarBis?: string;
  /** Text zum Start, wie er auf der Website stehen soll */
  start?: string;
  plaetze?: number;
  /** Hinweis zur Durchführung, z. B. Mindestteilnahme */
  hinweis?: string;
  /** Liefer- oder Vorbestellhinweis, erscheint direkt beim Kaufbutton */
  lieferhinweis?: string;
  /** Hinweis zum Kursstart nach der Buchung, erscheint in der Karte */
  startHinweis?: string;
  /** Von Hand auf true setzen, wenn alle Plätze vergeben sind */
  ausgebucht: boolean;
  status: 'verfuegbar' | 'in-vorbereitung';
  aktion: Aktion;
  /** Ziel, sobald das Angebot pausiert (nach Buchungsschluss oder ausgebucht) */
  aktionPausiert?: Aktion;
  /** Satz, der bei pausiertem Angebot erscheint */
  textPausiert?: string;
};

/**
 * Bestell-Adressen bei Digistore24. Nach der Produktfreigabe hier eintragen
 * (Digistore24 → Produkt → Bestellformular-Link, beginnt mit https://www.checkout-ds24.com/product/…).
 * Für einen Wechsel zu ablefy nur diese Adressen und den Anbieter in checkoutOderAnfrage austauschen.
 */
export const DIGISTORE24 = {
  kursbuch: '',
  club: '',
  einzel: '',
  vip: '',
} as const;

export type DigistoreId = keyof typeof DIGISTORE24;

/** Bestellbutton über Digistore24. Solange die Adresse fehlt, Bestellung per E-Mail (nur für die Vorschau). */
function checkoutOderAnfrage(url: string, label: string, ersatz: string, ersatzLabel = label): Aktion {
  return url
    ? { typ: 'checkout', anbieter: 'digistore24', url, label }
    : { typ: 'anfrage', url: ersatz, label: ersatzLabel };
}

const zurListe = (label = 'Benachrichtige mich zum Start'): Aktion => ({ typ: 'liste', url: seiten.liste, label });

// ---------------------------------------------------------------------------
// Angebote
// ---------------------------------------------------------------------------

export const angebote: Angebot[] = [
  {
    id: 'kursbuch',
    modul: 1,
    name: 'Das Kursbuch',
    art: 'Selbstständig',
    fuerDich: 'du gern allein und in deinem eigenen Tempo arbeitest.',
    enthaelt: 'das gedruckte Kursbuch mit 184 Seiten, neun Einheiten, zwei Praxiswochen und einer Probezeit von 14 Tagen.',
    preisEinfuehrung: 49,
    // OFFEN: regulärer Preis ab 08.12.2026 (Projektstatus V2 nennt keinen Wert)
    preisRegulaer: undefined,
    preisRegulaerBestaetigt: false,
    ausgebucht: false,
    status: 'verfuegbar',
    // Solange keine Exemplare auf Lager sind, wird vorbestellt. Mit Lagerbestand den Hinweis ändern,
    // z. B. „Versandfertig innerhalb von 2 Tagen“. Die Lieferzeit auch im Digistore24-Produkt eintragen.
    lieferhinweis: 'Jetzt vorbestellen: normalerweise versandfertig innerhalb von 7 Tagen.',
    aktion: checkoutOderAnfrage(
      DIGISTORE24.kursbuch,
      'Kursbuch vorbestellen',
      anfrageLink('Bestellung Kursbuch', 'Hallo Christine,\n\nich möchte das Kursbuch „Entwirf dein Zukunfts-Ich“ bestellen.\n\nLieferadresse:\n'),
    ),
  },
  {
    id: 'club',
    modul: 1,
    name: 'Life&Lemons Club',
    art: 'In der Gruppe',
    fuerDich: 'dir feste Termine in der Gruppe und der Austausch mit anderen helfen, dranzubleiben.',
    enthaelt: 'das Kursbuch, drei Treffen von 2 bis 3 Stunden in einer Kleingruppe in Hannover, Begleitung in der Probezeit und einen Abschluss-Call.',
    preisEinfuehrung: 299,
    // laut Projektstatus V2, noch nicht bestätigt
    preisRegulaer: 890,
    preisRegulaerBestaetigt: false,
    // 14 Tage Vorlauf für den Versand des Kursbuchs, Versand vor der Winterpause (entschieden 16.10.2026)
    buchbarBis: '2026-12-15',
    start: 'am 06.01.2027, Treffen am 06., 13. und 20.01.2027',
    plaetze: 6,
    hinweis: 'Die Gruppe findet ab zwei Anmeldungen statt.',
    // Entschieden 29.10.2026 (Christine): Versand erst ab zwei Anmeldungen; sonst Erstattung oder Wechsel in den Einzel-Track
    startHinweis:
      'Sobald mindestens zwei Anmeldungen da sind, schicke ich dir das Kursbuch, damit es vor dem ersten Treffen bei dir ist. Kommt die Gruppe nicht zustande, kannst du dir den Preis erstatten lassen oder in den Einzel-Track wechseln.',
    ausgebucht: false,
    status: 'verfuegbar',
    aktion: checkoutOderAnfrage(DIGISTORE24.club, 'Platz buchen', anfrageLink('Anmeldung Life&Lemons Club')),
    aktionPausiert: zurListe('Für die nächste Gruppe vormerken'),
    textPausiert: 'Die nächste Gruppe ist in Planung.',
  },
  {
    id: 'einzel',
    modul: 1,
    name: 'Einzel-Track',
    art: 'Persönlich begleitet',
    fuerDich: 'du in deinem Tempo arbeiten, die Reflexion und den Wandel aber lieber in Begleitung durchlaufen möchtest.',
    enthaelt: 'das Kursbuch, Begleitung per E-Mail und WhatsApp und zwei Telefonate mit mir. Ich unterstütze dich, wenn dich Zweifel oder alte Muster bremsen oder die Umsetzung deiner Pläne stockt.',
    preisEinfuehrung: 249,
    // laut Projektstatus V2, noch nicht bestätigt
    preisRegulaer: 790,
    preisRegulaerBestaetigt: false,
    // 14 Tage Vorlauf für den Versand des Kursbuchs (entschieden 16.10.2026)
    buchbarBis: '2026-11-29',
    start: 'spätestens am 13.12.2026',
    plaetze: 10,
    ausgebucht: false,
    status: 'verfuegbar',
    startHinweis: 'Dein Kurs beginnt, sobald das Kursbuch bei dir ist. Den genauen Starttermin vereinbaren wir nach deiner Buchung.',
    aktion: checkoutOderAnfrage(DIGISTORE24.einzel, 'Platz buchen', anfrageLink('Anmeldung Einzel-Track')),
    aktionPausiert: zurListe('Für Sommer 2027 vormerken'),
    textPausiert: 'Der Einzel-Track startet voraussichtlich ab Juli 2027 wieder.',
  },
  {
    id: 'vip',
    modul: 1,
    name: 'VIP-Track',
    art: 'Intensiv mit Christine',
    fuerDich: 'du den Kurs persönlich mit mir zu zweit durcharbeiten und deine Erkenntnisse mit gezieltem Feedback direkt auf deine Lebenssituation übertragen möchtest.',
    enthaelt: 'das Kursbuch, fünf Termine von je 2 Stunden in Hannover, einen WhatsApp- oder Signal-Zugang, über den ich täglich für dich erreichbar bin, einen gemeinsamen Plan für deine nächsten 90 Tage und ein Nachgespräch von 60 Minuten nach 3 Monaten.',
    preisEinfuehrung: 1900,
    // laut Projektstatus V2, noch nicht bestätigt
    preisRegulaer: 5900,
    preisRegulaerBestaetigt: false,
    // OFFEN: Variante Kursbuch-Tempo (Start 13.12.) oder Club-Rhythmus (Start 05.01.2027).
    // Eingetragen ist die frühere Variante.
    // 14 Tage Vorlauf für den Versand des Kursbuchs (entschieden 16.10.2026)
    buchbarBis: '2026-11-29',
    start: 'spätestens am 13.12.2026',
    plaetze: 3,
    ausgebucht: false,
    status: 'verfuegbar',
    startHinweis: 'Dein Kurs beginnt, sobald das Kursbuch bei dir ist. Den genauen Starttermin vereinbaren wir nach deiner Buchung.',
    aktion: checkoutOderAnfrage(DIGISTORE24.vip, 'Platz buchen', anfrageLink('Anmeldung VIP-Track')),
    aktionPausiert: zurListe('Benachrichtige mich'),
    textPausiert: 'Der VIP-Track pausiert. Ich melde mich, sobald es neue Termine gibt.',
  },
  {
    id: 'selbstlernkurs',
    modul: 1,
    name: 'Selbstlernkurs mit Video',
    art: 'In Vorbereitung',
    fuerDich: 'du mit dem Kursbuch allein arbeitest und dir zu jeder Einheit eine Erklärung im Video wünschst.',
    enthaelt: 'Videos zu den neun Einheiten.',
    preisRegulaerBestaetigt: false,
    ausgebucht: false,
    status: 'in-vorbereitung',
    aktion: zurListe(),
  },
  {
    id: 'kursbuch-band-2',
    modul: 2,
    name: 'Kursbuch Band 2',
    art: 'In Vorbereitung',
    fuerDich: 'du deine Richtung kennst und sie zu einem festen Teil deines Lebens machen möchtest.',
    enthaelt: 'das Kursbuch zu Modul 2, einzeln erhältlich, sobald es erscheint.',
    preisRegulaerBestaetigt: false,
    ausgebucht: false,
    status: 'in-vorbereitung',
    aktion: zurListe(),
  },
];

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

/**
 * Heutiges Datum in Berlin als JJJJ-MM-TT. Ausgewertet beim Bauen der Website.
 * Zum Testen lässt sich ein Datum vorgeben: STICHTAG_TEST=2026-12-08 npm run build
 */
export function heute(): string {
  const vorgabe = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.STICHTAG_TEST;
  if (vorgabe && /^\d{4}-\d{2}-\d{2}$/.test(vorgabe)) return vorgabe;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function angebotNachId(id: string): Angebot {
  const angebot = angebote.find((a) => a.id === id);
  if (!angebot) throw new Error(`Unbekanntes Angebot: ${id}`);
  return angebot;
}

export function einfuehrungAktiv(): boolean {
  return heute() <= STICHTAGE.einfuehrungBis;
}

export type AktuellerPreis = { betrag: number; einfuehrung: boolean };

/** Es wird immer nur der aktuell gültige Preis gezeigt, nie ein späterer. */
export function aktuellerPreis(angebot: Angebot): AktuellerPreis | null {
  if (einfuehrungAktiv() && angebot.preisEinfuehrung !== undefined) {
    return { betrag: angebot.preisEinfuehrung, einfuehrung: true };
  }
  if (angebot.preisRegulaer !== undefined && angebot.preisRegulaerBestaetigt) {
    return { betrag: angebot.preisRegulaer, einfuehrung: false };
  }
  return null;
}

/** Pausiert nach Buchungsschluss, wenn ausgebucht oder nach Ende der Begleitung. */
export function istPausiert(angebot: Angebot): boolean {
  if (angebot.status !== 'verfuegbar') return false;
  if (angebot.ausgebucht) return true;
  if (angebot.buchbarBis && heute() > angebot.buchbarBis) return true;
  return false;
}

export function istBuchbar(angebot: Angebot): boolean {
  return angebot.status === 'verfuegbar' && !istPausiert(angebot);
}

/** Die Aktion, die der Button gerade auslösen soll. */
export function aktuelleAktion(angebot: Angebot): Aktion {
  if (istPausiert(angebot) && angebot.aktionPausiert) return angebot.aktionPausiert;
  return angebot.aktion;
}

export function formatEuro(betrag: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(betrag);
}

/** 2026-12-07 → 07.12.2026 (ohne Zeitzonenumrechnung) */
export function formatDatum(iso: string): string {
  const [jahr, monat, tag] = iso.split('-');
  return `${tag}.${monat}.${jahr}`;
}

/** Buchbare Angebote, für die noch keine Digistore24-Adresse eingetragen ist. */
export function fehlendeBestelladressen(): DigistoreId[] {
  return (Object.keys(DIGISTORE24) as DigistoreId[]).filter((id) => !DIGISTORE24[id] && istBuchbar(angebotNachId(id)));
}

/** Hinweise beim Bauen, wenn eine Entscheidung fehlt. Erscheinen im Netlify-Protokoll. */
export function pruefeAngebote(): string[] {
  const hinweise: string[] = [];
  for (const id of fehlendeBestelladressen()) {
    hinweise.push(`Keine Digistore24-Adresse für „${angebotNachId(id).name}“ (DIGISTORE24.${id}). Vorerst per E-Mail.`);
  }
  if (!einfuehrungAktiv()) {
    for (const a of angebote) {
      if (a.status === 'verfuegbar' && !istPausiert(a) && aktuellerPreis(a) === null) {
        hinweise.push(`Kein bestätigter regulärer Preis für „${a.name}“. Es wird kein Preis angezeigt.`);
      }
    }
  }
  return hinweise;
}

/** Kurzer Hinweis unter einem Kauf- oder Anmeldebutton, passend zur Art der Aktion. */
export function bestellHinweis(angebot: Angebot): string | null {
  const aktion = aktuelleAktion(angebot);
  const kursbuch = angebot.id.startsWith('kursbuch');
  if (aktion.typ === 'checkout') {
    const anbieter = aktion.anbieter === 'digistore24' ? 'Digistore24' : 'ablefy';
    return `Die ${kursbuch ? 'Bestellung' : 'Buchung'} läuft über ${anbieter}.`;
  }
  // Bestellung per E-Mail gibt es nur in der Vorschau, solange Digistore24-Adressen fehlen: kein Hinweis
  return null;
}
