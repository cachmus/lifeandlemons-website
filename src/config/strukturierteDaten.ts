/**
 * Strukturierte Daten (JSON-LD) für Suchmaschinen.
 * Sie sind auf der Seite unsichtbar und beschreiben, wer hinter Life&Lemons steht, wo und für wen.
 * Alle Angaben kommen aus site.ts und angebote.ts; hier wird nichts zusätzlich behauptet.
 * Prüfen lassen sich die Daten mit https://validator.schema.org (Adresse der Seite eingeben).
 */
import { site, seiten } from './site';
import { angebotNachId, aktuellerPreis, istBuchbar, type Angebot } from './angebote';

const adresse = (pfad: string) => new URL(pfad, site.url).href;

export const ids = {
  website: adresse('/#website'),
  organisation: adresse('/#organisation'),
  person: adresse(`${seiten.ueberMich}#christine`),
  kursbuch: adresse(`${seiten.modul1}#kursbuch`),
  tryALife: adresse(`${seiten.tryALife}#app`),
  journal: adresse(`${seiten.journal}#journal`),
};

/**
 * Angebot mit aktuellem Preis für Suchmaschinen und KI-Assistenten (Audit heycatch, D5.5).
 * Nur der aktuell gültige Preis; ohne bestätigten Preis entfällt das Angebot.
 */
function angebotKnoten(a: Angebot, url: string, extra: Knoten = {}): Knoten | null {
  const preis = aktuellerPreis(a);
  if (!preis) return null;
  return {
    '@type': 'Offer',
    price: String(preis.betrag),
    priceCurrency: 'EUR',
    availability: istBuchbar(a) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url,
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    seller: { '@id': ids.organisation },
    ...extra,
  };
}

/** Marke als eigenes Objekt; ein reiner Verweis auf das Unternehmen gilt bei Google als ungültiger Typ (Search Console, 20.11.2026) */
const marke = () => ({ '@type': 'Brand', name: site.name });

/**
 * Versand und Rückgabe des gedruckten Workbooks (Search Console „Händlereinträge“, 20.11.2026).
 * Quellen: Versand im Preis enthalten (`versandInklusive` in angebote.ts), Versand nur innerhalb Deutschlands
 * (Christine, 30.10.2026), Widerruf 14 Tage per Post, Kundin trägt die Rücksendekosten (Seite /widerruf/).
 * Eine Lieferzeit (deliveryTime) fehlt bewusst: Die Laufzeit des Versanddienstes ist nicht festgelegt.
 */
const workbookVersandUndRueckgabe = (a: Angebot): Knoten => ({
  ...(a.versandInklusive && {
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'DE' },
    },
  }),
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'DE',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnShippingFees',
    merchantReturnLink: adresse(seiten.widerruf),
  },
});

type Knoten = Record<string, unknown>;

/** Öffentliche Profile für sameAs; LinkedIn und weitere Profile erst, wenn in site.ts eingetragen (Audit a_sameas) */
const profile = () => [site.instagram.url, ...(site.linkedin ? [site.linkedin] : []), ...site.weitereProfile.filter((u) => /^https:\/\//.test(u))];

/**
 * Das Unternehmen Life&Lemons (Organization). Steht als eigener Block im gemeinsamen Kopf jeder Seite (Base.astro),
 * damit Suchmaschinen und KI-Assistenten die Marke auf der Website mit Erwähnungen anderswo verbinden.
 * Name überall genau „Life&Lemons“ (site.name); andere Schreibweisen nur als alternateName.
 */
export function organisationDaten(): Knoten {
  return {
    '@context': 'https://schema.org',
    // Organization ausdrücklich, ProfessionalService als genauere Art (Audit geo-audit a_org_schema, 19.11.2026)
    '@type': ['Organization', 'ProfessionalService'],
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
    // Treffen in Hannover, Einzelbegleitung online in Deutschland (Workbook-Versand nur innerhalb Deutschlands)
    areaServed: [
      { '@type': 'City', name: site.ort.stadt },
      { '@type': 'Country', name: 'Deutschland' },
    ],
    knowsLanguage: 'de',
    sameAs: profile(),
  };
}

/** Erscheint auf jeder indexierten Seite: Website und Inhaberin. Das Unternehmen steht in organisationDaten(). */
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
      '@type': 'Person',
      '@id': ids.person,
      name: site.inhaberin,
      jobTitle: site.rolle,
      url: adresse(seiten.ueberMich),
      worksFor: { '@id': ids.organisation },
      homeLocation: { '@type': 'City', name: site.ort.stadt },
      sameAs: profile(),
    },
  ];
}

/** Das Workbook als Buch mit Autorin und aktuellem Preis (Seite Modul 1). `umschlag`: Pfad des Umschlagbilds. */
export function kursbuchDaten(umschlag?: string): Knoten {
  const kursbuch = angebotNachId('kursbuch');
  const angebot = angebotKnoten(kursbuch, ids.kursbuch, workbookVersandUndRueckgabe(kursbuch));
  return {
    // Buch und Produkt zugleich, damit der Preis als Produktangebot lesbar ist (D5.5)
    '@type': ['Book', 'Product'],
    '@id': ids.kursbuch,
    name: 'Entwirf dein Zukunfts-Ich',
    description: 'Workbook zum Selbstarbeiten in neun Einheiten mit zwei Praxiswochen und einer Probezeit von 14 Tagen.',
    author: { '@id': ids.person },
    publisher: { '@id': ids.organisation },
    inLanguage: 'de',
    numberOfPages: 184,
    url: ids.kursbuch,
    image: adresse(umschlag ?? '/marke/og-bild.png'),
    brand: marke(),
    ...(angebot && { offers: angebot }),
  };
}

/** Die App Try a Life als Produkt mit aktuellem Preis (Startseite und /try-a-life/). `bild`: Pfad eines Bilds der App. */
export function tryALifeDaten(bild?: string): Knoten {
  const app = angebotNachId('try-a-life');
  const angebot = angebotKnoten(app, adresse(seiten.tryALife));
  return {
    '@type': ['Product', 'SoftwareApplication'],
    '@id': ids.tryALife,
    name: 'Try a Life',
    description: `Life-Coaching-App im Format eines Cozy Games: ${app.enthaelt}`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Browser',
    inLanguage: 'de-DE',
    url: adresse(seiten.tryALife),
    image: adresse(bild ?? '/marke/og-try-a-life.jpg'),
    author: { '@id': ids.person },
    brand: marke(),
    ...(angebot && { offers: angebot }),
  };
}

/** Art der Seite und zusätzliche Angaben für den Seitenknoten (Base.astro, Prop `seite`) */
export type SeitenAngaben = { typ?: 'WebPage' | 'ProfilePage' | 'CollectionPage' | 'AboutPage'; felder?: Knoten };

/**
 * Die Seite selbst (Audit geo-audit g_structured_data, 19.11.2026): erscheint auf jeder indexierten Seite außer
 * Ratgeberartikeln (die haben BlogPosting). Wird in Base.astro aus denselben Werten wie <title>, Beschreibung,
 * Canonical und Vorschaubild erzeugt, nie als feste Kopie.
 */
export function seitenDaten(a: { url: string; titel: string; beschreibung: string; bild: string; seite?: SeitenAngaben }): Knoten {
  return {
    '@type': a.seite?.typ ?? 'WebPage',
    '@id': `${a.url}#seite`,
    url: a.url,
    name: a.titel,
    headline: a.titel,
    description: a.beschreibung,
    inLanguage: 'de-DE',
    mainEntityOfPage: a.url,
    image: adresse(a.bild),
    primaryImageOfPage: { '@type': 'ImageObject', url: adresse(a.bild) },
    isPartOf: { '@id': ids.website },
    publisher: { '@id': ids.organisation },
    ...a.seite?.felder,
  };
}

/**
 * Über mich als Profilseite der Autorin (Audit geo-audit a_author_page, 19.11.2026): ProfilePage mit der Person
 * und den Artikeln, die sie geschrieben hat. Wird als `seite` an Base.astro übergeben.
 */
export function profilseite(artikel: { titel: string; pfad: string }[]): SeitenAngaben {
  return {
    typ: 'ProfilePage',
    felder: {
      mainEntity: { '@id': ids.person },
      hasPart: artikel.map((a) => ({ '@type': 'BlogPosting', headline: a.titel, url: adresse(a.pfad), author: { '@id': ids.person } })),
    },
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
    // Nur Dokument: Ein kostenloses PDF ist kein Händlerangebot für Google (Search Console, 20.11.2026)
    '@type': 'DigitalDocument',
    '@id': ids.journal,
    name: 'Wer will ich in 12 Monaten sein? Das Jahresabschluss-Journal',
    description:
      'Journal für deinen persönlichen Jahresrückblick mit Ausblick: Rückblick, Who-to-be-Liste, Rückwärtsplanung, Wenn-dann-Pläne und ein erster Schritt. 17 Seiten als PDF.',
    url: adresse(seiten.journal),
    image: adresse(cover),
    inLanguage: 'de-DE',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: adresse(seiten.journal),
      seller: { '@id': ids.organisation },
    },
    numberOfPages: 17,
    encodingFormat: 'application/pdf',
    author: { '@id': ids.person },
    publisher: { '@id': ids.organisation },
  };
}
