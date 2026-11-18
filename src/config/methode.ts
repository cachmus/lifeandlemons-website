/**
 * Die sieben Phasen der Methode (Positionierungspapier V4, § 3 und § 4), genutzt auf „Wie ich arbeite“ und „Über mich“.
 * Zeichen: Gegenstände aus Try a Life (Rechte bei Christine, Neugestaltung 16.11.2026), Phase 1 zeichnet PhaseZeichen.astro.
 */
import symSanduhr from '../assets/symbole/sanduhr.png';
import symGondel from '../assets/symbole/gondel.png';
import symWegweiser from '../assets/symbole/wegweiser.png';
import symKompass from '../assets/symbole/kompass.png';
import symTelefon from '../assets/symbole/telefon.png';
import symMokkakanne from '../assets/symbole/mokkakanne.png';

export const phasen = [
  {
    titel: 'Verstehen, wo du stehst',
    text: 'Ein Lebensrad mit neun Feldern zeigt dir, was fehlt und was dich schon trägt: Familie, Freundschaft, Liebe, Innenleben, Körper, Entwicklung, Geld, Beitrag und Freude. Dazu kommen deine Stärken, deine Ressourcen, Tätigkeiten, die du abgeben oder reduzieren möchtest, und dein Element. Dort kommen Stärken, Interessen und Sinn zusammen, und du gehst ganz in einer Tätigkeit auf.',
    frage: 'Was fehlt mir, und was trägt mich schon?',
    symbol: null,
  },
  {
    titel: 'Erkennen, was dich bremst',
    text: 'Du findest heraus, welche inneren Muster dich bislang gebremst haben, und untersuchst, wie sie heute wirken. Ihre Entstehung arbeiten wir nicht auf.',
    frage: 'Welche Muster haben mich bisher zurückgehalten?',
    symbol: symSanduhr,
  },
  {
    titel: 'Drei mögliche Leben entwerfen',
    text: 'Mit gelöster Bremse entstehen drei völlig unterschiedliche Entwürfe. Weitergehen fragt, was sich ändert, wenn du deinen Weg mutiger gehst. Umsteigen fragt, was du aufbaust, wenn dein bisheriger Weg wegfällt. Wagen fragt, was du tust, wenn ein Scheitern dich nicht aus der Bahn werfen kann.',
    frage: 'Welche Leben wären für mich möglich?',
    symbol: symGondel,
  },
  {
    titel: 'Spüren, welcher Entwurf dich anzieht',
    text: 'Du vergleichst deine Entwürfe danach, wie sehr sie emotional und persönlich zu dir passen.',
    frage: 'Welchen Menschen, der ich in fünf Jahren in diesem Entwurf wäre, würde ich gern kennenlernen?',
    symbol: symWegweiser,
  },
  {
    titel: 'Klären, was dir wichtig ist',
    text: 'Aus deinen drei Entwürfen arbeitest du heraus, welche Werte und Bedürfnisse immer wieder auftauchen und wer dein gewünschtes Zukunfts-Ich ist. Daran orientieren sich deine Tests.',
    frage: 'Was taucht in allen meinen Entwürfen wieder auf?',
    symbol: symKompass,
  },
  {
    titel: 'Ausprobieren und nachjustieren',
    text: 'Du sprichst mit Menschen, die ein ähnliches Leben führen, und probierst einzelne Bestandteile deines gewünschten Alltags aus. Deine Erfahrungen gleichst du mit deinen Werten ab und setzt daraus deinen eigenen Weg zusammen. Er darf Elemente aus allen drei Entwürfen enthalten.',
    frage: 'Stimmen meine Annahmen über dieses Leben?',
    symbol: symTelefon,
  },
  {
    titel: 'Im Alltag verankern',
    text: 'Du übersetzt deinen Weg in Meilensteine, Gewohnheiten, Wenn-dann-Pläne und einen Alltag, der es dir leicht macht. Deine Werte geben dir die Richtung, ein bewusst gewähltes Lebensgefühl ist dein Maßstab.',
    frage: 'Was tue ich regelmäßig als der Mensch, der ich werden will?',
    symbol: symMokkakanne,
  },
];
