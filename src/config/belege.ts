/**
 * Belege von anderen Menschen: Stimmen, Zahlen und Bewertungen (Audit heycatch, 19.11.2026: D3.1, D3.2, D3.5).
 *
 * Alles hier ist PLATZHALTER, bis Christine echte Angaben einträgt. Solange eine Liste leer oder ein Wert `null` ist,
 * erscheint auf der Website nichts davon. Nichts erfinden: keine Stimme ohne schriftliche Einwilligung, keine Zahl ohne Quelle.
 */
import type { ImageMetadata } from 'astro';

export type Stimme = {
  /** Vorname und erster Buchstabe des Nachnamens, so wie die Person genannt werden möchte, z. B. „Sabine R.“ */
  name: string;
  /** Wörtliches Zitat, ein bis zwei Sätze, ohne Kürzung des Sinns */
  zitat: string;
  /** Konkretes Ergebnis in den Worten der Person, z. B. „Nach der Probezeit habe ich meinen Job gewechselt.“ */
  ergebnis?: string;
  /** Womit die Person gearbeitet hat */
  format: 'Try a Life' | 'Workbook' | 'Journal';
  /** Foto nur mit Einwilligung, Datei in src/assets/stimmen/ */
  foto?: ImageMetadata;
  /** Datum der schriftlichen Einwilligung (JJJJ-MM-TT). Ohne Einwilligung nicht eintragen. */
  einwilligung: string;
};

/**
 * PLATZHALTER: fünf Stimmen von Käuferinnen und Käufern der App und des Workbooks.
 * Erscheinen auf der Startseite (zwischen „Über mich“ und den Einstiegen) und auf /try-a-life/.
 */
export const stimmen: Stimme[] = [];

/**
 * PLATZHALTER: eine echte Zahl mit Quelle, z. B. Downloads des Journals aus Brevo oder Käufe aus Digistore24.
 * Beispiel: { text: 'Über 300 Menschen haben das Journal in diesem Jahr geholt', quelle: 'Brevo, Liste #11', stand: '2026-12-01' }
 * Erscheint unter den Knöpfen im ersten Bildschirm der Startseite.
 */
export const zahlBeleg: { text: string; quelle: string; stand: string } | null = null;

/**
 * PLATZHALTER: Bewertungen auf einer unabhängigen Plattform (z. B. ProvenExpert oder Trustpilot), erst ab einigen echten Bewertungen.
 * Erscheint im Footer und unter dem Vergleich der Einstiege auf der Startseite.
 */
export const bewertungen: { anbieter: string; url: string; note: number; anzahl: number } | null = null;
