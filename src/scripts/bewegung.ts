/**
 * Bewegung auf der Website: Elemente erscheinen beim Scrollen, die Kopfzeile weicht beim
 * Herunterscrollen aus. Alles ist ohne JavaScript und bei reduzierter Bewegung sofort sichtbar.
 */

const AUSWAHL = '[data-erscheinen], .zeile, [data-treppe]';

function erscheinen(): void {
  const elemente = document.querySelectorAll<HTMLElement>(AUSWAHL);
  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ruhig || !('IntersectionObserver' in window)) {
    elemente.forEach((el) => el.classList.add('on'));
    return;
  }
  const beobachter = new IntersectionObserver(
    (eintraege) => {
      for (const eintrag of eintraege) {
        if (eintrag.isIntersecting) {
          eintrag.target.classList.add('on');
          beobachter.unobserve(eintrag.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  elemente.forEach((el) => beobachter.observe(el));
}

function kopfzeile(): void {
  const kopf = document.querySelector<HTMLElement>('[data-kopf]');
  if (!kopf) return;
  let zuletzt = window.scrollY;
  let geplant = false;

  const aktualisieren = () => {
    const y = window.scrollY;
    const runter = y > zuletzt + 4;
    const hoch = y < zuletzt - 4;
    if (runter && y > 160) kopf.classList.add('kopf--weg');
    else if (hoch || y <= 160) kopf.classList.remove('kopf--weg');
    if (runter || hoch) zuletzt = y;
    geplant = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!geplant) {
        geplant = true;
        requestAnimationFrame(aktualisieren);
      }
    },
    { passive: true },
  );

  // Wer mit der Tastatur in die Kopfzeile springt, soll sie sehen.
  kopf.addEventListener('focusin', () => kopf.classList.remove('kopf--weg'));
}

export function starteBewegung(): void {
  document.documentElement.setAttribute('data-bereit', '');
  erscheinen();
  kopfzeile();
}
