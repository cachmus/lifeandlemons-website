/**
 * Strukturierte Daten (JSON-LD) für Suchmaschinen.
 * Sie sind auf der Seite unsichtbar und beschreiben, wer hinter Life&Lemons steht, wo und für wen.
 * Alle Angaben kommen aus site.ts und angebote.ts; hier wird nichts zusätzlich behauptet.
 * Prüfen lassen sich die Daten mit https://validator.schema.org (Adresse der Seite eingeben).
 */
import { site, seiten } from './site';
import { angebotNachId, aktuellerPreis } from './angebote';

const adresse = (pfad: string) => new URL(pfad, site.url).href;

export const ids = {
  website: adresse('/#website'),
  organisation: adresse('/#organisation'),
  person: adresse(`${seiten.ueberMich}#christine`),
  kursbuch: adresse(`${seiten.modul1}#kursbuch`),
};

type Knoten = Record<string, unknown>;

/** Erscheint auf jeder Seite: Website, Unternehmen und Inhaberin. */
export function grunddaten(): Knoten[] {
  return [
    {
      '@type': 'WebSite',
      '@id': ids.website,
      url: adresse('/'),
      name: site.name,
      // Suchmaschinen behandeln das „&“ uneinheitlich, deshalb beide Schreibweisen
      alternateName: ['Life and Lemons', 'Life & Lemons'],
      inLanguage: 'de-DE',
      publisher: { '@id': ids.organisation },
    },
    {
      '@type': 'ProfessionalService',
      '@id': ids.organisation,
      name: site.name,
      alternateName: ['Life and Lemons', site.firmierung],
      slogan: site.slogan,
      description: `Mentoring und Life Coaching für selbstbestimmte Lebensgestaltung von ${site.inhaberin}, in ${site.ort.stadt} und online.`,
      url: adresse('/'),
      logo: adresse('/apple-touch-icon.png'),
      image: adresse('/marke/og-bild.png'),
      email: site.kontaktEmail,
      founder: { '@id': ids.person },
      // Nur die Stadt: Life&Lemons ist ein Unternehmen mit Einzugsgebiet ohne öffentliche Geschäftsräume
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.ort.stadt,
        addressRegion: site.ort.region,
        addressCountry: site.ort.land,
      },
      // Treffen in Hannover, Einzelbegleitung online in Deutschland (Kursbuch-Versand nur innerhalb Deutschlands)
      areaServed: [
        { '@type': 'City', name: site.ort.stadt },
        { '@type': 'Country', name: 'Deutschland' },
      ],
      knowsLanguage: 'de',
      sameAs: [site.instagram.url],
    },
    {
      '@type': 'Person',
      '@id': ids.person,
      name: site.inhaberin,
      jobTitle: site.rolle,
      url: adresse(seiten.ueberMich),
      worksFor: { '@id': ids.organisation },
      homeLocation: { '@type': 'City', name: site.ort.stadt },
      sameAs: [site.instagram.url],
    },
  ];
}

/** Das Kursbuch als Buch mit Autorin und aktuellem Preis (Seite Modul 1). `umschlag`: Pfad des Umschlagbilds. */
export function kursbuchDaten(umschlag?: string): Knoten {
  const kursbuch = angebotNachId('kursbuch');
  const preis = aktuellerPreis(kursbuch);
  return {
    '@type': 'Book',
    '@id': ids.kursbuch,
    name: 'Entwirf dein Zukunfts-Ich',
    description: 'Kursbuch zum Selbstarbeiten in neun Einheiten mit zwei Praxiswochen und einer Probezeit von 14 Tagen.',
    author: { '@id': ids.person },
    publisher: { '@id': ids.organisation },
    inLanguage: 'de',
    numberOfPages: 184,
    url: ids.kursbuch,
    image: adresse(umschlag ?? '/marke/og-bild.png'),
    // Nur der aktuell gültige Preis; ohne bestätigten Preis entfällt das Angebot
    ...(preis && {
      offers: {
        '@type': 'Offer',
        price: String(preis.betrag),
        priceCurrency: 'EUR',
        url: ids.kursbuch,
        areaServed: { '@type': 'Country', name: 'Deutschland' },
        seller: { '@id': ids.organisation },
      },
    }),
  };
}

/** Ratgeberartikel mit Brotkrumen und, falls vorhanden, Fragen und Antworten (Seiten /ratgeber/<slug>/). */
export function artikelDaten(a: {
  titel: string;
  beschreibung: string;
  pfad: string;
  veroeffentlicht: string;
  aktualisiert?: string;
  faq?: { frage: string; antwort: string }[];
}): Knoten[] {
  const url = adresse(a.pfad);
  const knoten: Knoten[] = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#artikel`,
      headline: a.titel,
      description: a.beschreibung,
      url,
      mainEntityOfPage: url,
      inLanguage: 'de-DE',
      datePublished: a.veroeffentlicht,
      dateModified: a.aktualisiert ?? a.veroeffentlicht,
      author: { '@id': ids.person },
      publisher: { '@id': ids.organisation },
      image: adresse('/marke/og-bild.png'),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ratgeber', item: adresse(seiten.ratgeber) },
        { '@type': 'ListItem', position: 2, name: a.titel, item: url },
      ],
    },
  ];
  if (a.faq?.length) knoten.push(faqDaten(a.faq));
  return knoten;
}

/** Fragen und Antworten, die sichtbar auf der Seite stehen. */
export function faqDaten(faq: { frage: string; antwort: string }[]): Knoten {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
  };
}

/** Das kostenlose Journal als frei zugängliches Dokument (Seite /journal/). */
export function journalDaten(cover: string): Knoten {
  return {
    '@type': 'DigitalDocument',
    '@id': adresse(`${seiten.journal}#journal`),
    name: 'Wer will ich in 12 Monaten sein? Das Jahresabschluss-Journal',
    description:
      'Journal für deinen persönlichen Jahresrückblick mit Ausblick: Rückblick, Who-to-be-Liste, Rückwärtsplanung, Wenn-dann-Pläne und ein erster Schritt. 17 Seiten als PDF.',
    url: adresse(seiten.journal),
    image: adresse(cover),
    inLanguage: 'de-DE',
    isAccessibleForFree: true,
    numberOfPages: 17,
    encodingFormat: 'application/pdf',
    author: { '@id': ids.person },
    publisher: { '@id': ids.organisation },
  };
}
