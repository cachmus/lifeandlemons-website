/**
 * Nutzungsmessung mit HeyCatch (entschieden 20.11.2026, Christine; ersetzt „kein Tracking“ vom 19.11.2026).
 * Einrichtung nach https://heycatch.ai/agents.md.
 *
 * Datenschutz: Nichts wird gesendet und nichts im Browser gespeichert, bevor die Besucherin im Hinweis
 * „Zulassen“ wählt (`optOutCapturingByDefault`). Die Wahl steht im selben Eintrag wie die Messung von Netlify
 * (`messung` in src/config/site.ts) und wird bei jedem Seitenaufruf neu angewendet, weil das SDK sie nicht speichert.
 * IP-Adressen werden nicht erfasst (`collectIp: false`); Sitzungsaufzeichnungen sind im SDK abgeschaltet.
 *
 * Der Projektschlüssel ist ein öffentlicher Schlüssel (hck_pk_…) und gehört nicht zu den Zugangsdaten.
 */
import { analytics } from '@heycatch/sdk';
import { messung } from '../config/site';

/** Liegt eine gültige Einwilligung vor? Gleiche Regel wie im Hinweis (Einwilligung.astro) und im <head> von Base.astro. */
export function messungErlaubt(): boolean {
  try {
    const [wahl, zeit] = (localStorage.getItem(messung.speicherSchluessel) ?? '').split(':');
    return wahl === 'ja' && Date.now() - Number(zeit) < messung.gueltigTage * 86_400_000;
  } catch {
    return false;
  }
}

analytics.init({
  projectKey: 'hck_pk_Pru5nNpBH92bNYwqJYtlyEPs3ULR_tbS',
  install: { framework: 'astro', frameworkVersion: '7', agent: 'claude-code' },
  // Website und App Try a Life sind getrennte Projekte: Besuche der Website als Landingpage kennzeichnen
  site: 'landing',
  // Jede Seite ist ein eigener Seitenaufruf: ohne Sammeln senden, sonst gehen Aufrufe beim Weiterklicken verloren
  requestBatching: false,
  optOutCapturingByDefault: true,
  collectIp: false,
});

if (messungErlaubt()) analytics.optInCapturing();

export { analytics };
