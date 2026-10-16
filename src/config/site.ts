/**
 * Zentrale Angaben zur Website.
 * Navigation, Kontakt, Newsletter-Anbindung und Schalter für den Livegang stehen hier, nicht verteilt im Code.
 */

export const site = {
  name: 'Life&Lemons',
  url: 'https://lifeandlemons.de',
  inhaberin: 'Christine Achmus',
  rolle: 'Mentorin für Lebensentwürfe',
  slogan: 'Sei, wer du werden willst.',
  kontaktEmail: 'christine@lifeandlemons.de',
  /** Handle laut Kursbuch-Umschlag und Broschüre */
  instagram: { handle: '@christineachmus', url: 'https://www.instagram.com/christineachmus/' },
  /**
   * Solange false, tragen alle Seiten "noindex". Vor dem Livegang auf true setzen,
   * sobald Impressum und Datenschutz geprüft sind.
   */
  indexierbar: false,
} as const;

/** Feste Adressen der Seiten. Veröffentlichte URLs nicht ändern, sonst Weiterleitung in netlify.toml eintragen. */
export const seiten = {
  start: '/',
  modul1: '/programme/entwirf-dein-zukunfts-ich/',
  modul2: '/programme/manifestiere-dein-zukunfts-ich/',
  ueberMich: '/ueber-mich/',
  impressum: '/impressum/',
  datenschutz: '/datenschutz/',
  /** Anker der Interessentenliste auf der Startseite */
  liste: '/#liste',
} as const;

/**
 * OFFEN: Zusatz zu jedem Preis, z. B. „inkl. MwSt.“ oder bei Kleinunternehmerregelung
 * „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ Mit Steuerberatung klären und hier eintragen.
 */
export const preisZusatz = '';

export type NavPunkt = { label: string; href: string };

export const hauptnavigation: NavPunkt[] = [
  { label: 'Entwerfen', href: seiten.modul1 },
  { label: 'Manifestieren', href: seiten.modul2 },
  { label: 'Über mich', href: seiten.ueberMich },
];

export const fussnavigation: NavPunkt[] = [
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
