/**
 * Zentrale Angaben zur Website.
 * Navigation, Kontakt, Newsletter-Anbindung und Schalter für den Livegang stehen hier, nicht verteilt im Code.
 */

export const site = {
  name: 'Life&Lemons',
  /** Hauptadresse mit www (entschieden 19.10.2026); muss mit `site` in astro.config.mjs übereinstimmen */
  url: 'https://www.lifeandlemons.de',
  inhaberin: 'Christine Achmus',
  /**
   * Geschäftsbezeichnung für Impressum und Rechtstexte (entschieden 27.10.2026, Christine).
   * Ohne Handelsregistereintrag ist das keine Firma im Sinne des HGB; der vollständige Name der Inhaberin
   * muss deshalb zusätzlich genannt werden. Fachlich zu prüfen.
   */
  firmierung: 'Life&Lemons | Mentoring by Christine Achmus',
  rolle: 'Mentorin für Lebensentwürfe',
  slogan: 'Sei, wer du werden willst.',
  kontaktEmail: 'christine@lifeandlemons.de',
  /** Ladungsfähige Anschrift für Impressum, Datenschutz und später den Newsletter-Fuß (entschieden 19.10.2026: Privatadresse) */
  anschrift: { strasse: 'Hesemannstr. 13', plzOrt: '30655 Hannover' },
  /** Handle laut Kursbuch-Umschlag und Broschüre */
  instagram: { handle: '@christineachmus', url: 'https://www.instagram.com/christineachmus/' },
  /**
   * Ort für Suchmaschinen und strukturierte Daten. Öffentlich erscheint nur die Stadt, keine Straße
   * (Unternehmensprofil mit Einzugsgebiet, entschieden 30.10.2026).
   */
  ort: { stadt: 'Hannover', region: 'Niedersachsen', land: 'DE' },
  /**
   * Suchmaschinen dürfen die Seite aufnehmen (entschieden 30.10.2026, Christine), auch bevor alle
   * Digistore24-Produkte freigegeben sind. Mit false tragen alle Seiten wieder "noindex".
   * Impressum und Datenschutz sind weiterhin fachlich zu prüfen.
   */
  indexierbar: true,
} as const;

/**
 * Adressen, die nie in der Suche erscheinen sollen (Anfang des Pfads).
 * Gilt für das robots-Meta-Tag in Base.astro und für die Sitemap.
 */
export const ohneSuche = ['/danke/', '/404'] as const;

export function inDerSuche(pfad: string): boolean {
  return !ohneSuche.some((anfang) => pfad.startsWith(anfang));
}

/** Feste Adressen der Seiten. Veröffentlichte URLs nicht ändern, sonst Weiterleitung in netlify.toml eintragen. */
export const seiten = {
  start: '/',
  modul1: '/programme/entwirf-dein-zukunfts-ich/',
  modul2: '/programme/manifestiere-dein-zukunfts-ich/',
  /** Methode, Rolle, Grundlagen und Grenzen (neu 30.10.2026) */
  wieIchArbeite: '/wie-ich-arbeite/',
  ueberMich: '/ueber-mich/',
  impressum: '/impressum/',
  datenschutz: '/datenschutz/',
  /** Danke-Seite nach dem Kauf des Kursbuchs; in Digistore24 im Produkt als Dankeseite eintragen. Immer noindex. */
  dankeKursbuch: '/danke/kursbuch/',
  /** Anker der Interessentenliste auf der Startseite */
  liste: '/#liste',
} as const;

/**
 * OFFEN: Zusatz zu jedem Preis, z. B. „inkl. MwSt.“ oder bei Kleinunternehmerregelung
 * „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ Mit Steuerberatung klären und hier eintragen.
 */
export const preisZusatz = '';

export type NavPunkt = { label: string; href: string };

/**
 * Reiter in Alltagssprache (entschieden 30.10.2026, ersetzt „Entwerfen“ und „Manifestieren“).
 * Modul 2 kommt erst ins Hauptmenü, wenn es buchbar ist; bis dahin über Startseite, „Wie ich arbeite“,
 * die Seite zu Modul 1 und den Footer erreichbar.
 */
export const hauptnavigation: NavPunkt[] = [
  { label: 'Wie ich arbeite', href: seiten.wieIchArbeite },
  { label: 'Angebot', href: seiten.modul1 },
  { label: 'Über mich', href: seiten.ueberMich },
];

export const fussnavigation: NavPunkt[] = [
  { label: 'Modul 2 · in Vorbereitung', href: seiten.modul2 },
  { label: 'Impressum', href: seiten.impressum },
  { label: 'Datenschutz', href: seiten.datenschutz },
];

/**
 * Interessentenliste über Brevo (Double-Opt-in).
 *
 * Einrichtung in Brevo (Konto von Christine):
 * 1. Kontakte → Listen: eine Liste je Interesse anlegen (siehe `interessen`) und die Listen-IDs notieren.
 * 2. Kontakte → Formulare: ein Anmeldeformular mit Double-Opt-in anlegen, E-Mail-Feld und
 *    Listenauswahl („Liste vom Kontakt auswählen lassen“) mit den vier Listen.
 * 3. Unter „Teilen“ den HTML-Code anzeigen und daraus die Adresse im Attribut `action` des
 *    <form>-Elements kopieren (beginnt mit https://…sibforms.com/serve/…). Diese Adresse hier eintragen.
 * 4. Die Listen-IDs unten bei `brevoListe` eintragen.
 * 5. Einstellungen → Kontakte → „Per-contact pixel tracking consent“: „Track contacts whose consent is unknown“ auf „No“
 *    stellen und kein Zustimmungsfeld für Tracking ins Formular aufnehmen. Die Datenschutzerklärung sagt zu, dass
 *    Öffnungen und Klicks nicht ausgewertet werden (entschieden 19.10.2026).
 *
 * Die Formular-Adresse ist öffentlich und kein geheimer Schlüssel. Ein API-Schlüssel gehört nie hierher.
 * Solange `formularAdresse` leer ist, zeigt die Website statt des Formulars einen Hinweis mit E-Mail-Link.
 */
export const newsletter = {
  formularAdresse: '',
  interessen: [
    { id: 'modul2', label: 'Kursbuch Band 2 und Modul 2 „Manifestiere dein Zukunfts-Ich“', brevoListe: '' },
    { id: 'selbstlernkurs', label: 'Selbstlernkurs mit Video', brevoListe: '' },
    { id: 'club', label: 'die nächste Gruppe im Life&Lemons Club', brevoListe: '' },
    { id: 'einzel', label: 'den Einzel-Track ab Sommer 2027', brevoListe: '' },
  ],
  /**
   * PLATZHALTER: Einwilligungstext. Vor dem Livegang durch den Text aus dem Brevo-Formular ersetzen
   * und fachlich prüfen lassen.
   */
  einwilligung:
    'Mit dem Eintragen willigst du ein, dass ich dir zu den ausgewählten Themen E-Mails schicke. Du bekommst zuerst eine E-Mail, mit der du deine Anmeldung bestätigst. Der Versand läuft über Brevo. Abmelden kannst du dich jederzeit über den Link in jeder E-Mail.',
} as const;

export type InteresseId = (typeof newsletter.interessen)[number]['id'];

/** Baut einen mailto-Link mit vorbefülltem Betreff und optional Text. */
export function anfrageLink(betreff: string, text?: string): string {
  const teile = [`subject=${encodeURIComponent(betreff)}`];
  if (text) teile.push(`body=${encodeURIComponent(text)}`);
  return `mailto:${site.kontaktEmail}?${teile.join('&')}`;
}

/**
 * Leistungsmessung von Netlify („Real User Monitoring“), nur mit Einwilligung (entschieden 19.10.2026).
 *
 * Netlify fügt das Messskript auf der Live-Seite selbst ein, die Website kann das Laden nicht verhindern.
 * Deshalb hält ein kleines Skript im <head> (Base.astro) jede Übertragung an `host` zurück, bis die Besucherin
 * im Hinweis „Zulassen“ gewählt hat. Ohne Einwilligung verlässt keine Messung den Browser.
 * Das Banner erscheint nur, wenn das Messskript auf der Seite steckt; ist die Messung bei Netlify
 * abgeschaltet, gibt es auch kein Banner.
 *
 * Geprüft am 19.10.2026: Das Skript sendet Seitenadresse, Betriebssystem, Bildschirmgröße und Ladezeiten
 * an `host`, setzt keine Cookies und speichert nichts im Browser. Ändert Netlify die Zieladresse,
 * muss `host` angepasst werden, sonst greift die Sperre nicht.
 */
export const messung = {
  host: 'ingesteer.services-prod.nsvcs.net',
  /** Hier merkt sich der Browser die Entscheidung („ja:<Zeitpunkt>“ oder „nein:<Zeitpunkt>“) */
  speicherSchluessel: 'lifeandlemons-einwilligung-messung',
  /** Nach dieser Zeit wird erneut gefragt */
  gueltigTage: 365,
} as const;
