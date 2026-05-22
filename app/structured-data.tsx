import { getSiteUrl } from "@/lib/site-url";

export default function StructuredData() {
  const siteUrl = getSiteUrl();
  const year = new Date().getFullYear();
  const logoUrl = `${siteUrl}/Logo_RO_PB(ALB)2.svg`;
  const heroImageUrl = `${siteUrl}/8.close-up-smiley-kids-team.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Taberele Micilor Ingineri",
        alternateName: ["Tabere Micilor Ingineri", "Micilor Ingineri UPB"],
        url: siteUrl,
        logo: logoUrl,
        description:
          "Tabere urbane POLITEHNICA București pentru copii între 5 și 11 ani: activități interactive, ateliere practice și înscriere online.",
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Universitatea Națională de Știință și Tehnologie POLITEHNICA București",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Splaiul Independenței nr. 313",
          addressLocality: "București",
          addressCountry: "RO",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: "marketing@upb.ro",
            contactType: "customer service",
            areaServed: "RO",
            availableLanguage: ["ro", "en"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Taberele Micilor Ingineri",
        description:
          "Tabere urbane POLITEHNICA București pentru copii curioși: activități interactive, ateliere practice și înscriere online.",
        inLanguage: "ro-RO",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Event",
        "@id": `${siteUrl}/#tabere-micilor-ingineri`,
        name: `Taberele Micilor Ingineri ${year}`,
        description:
          "Tabără de vară urbană pe campusul POLITEHNICA București pentru copii între 5 și 11 ani: experimente, ateliere STEM și activități ghidate.",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        audience: {
          "@type": "Audience",
          audienceType: "Copii între 5 și 11 ani",
        },
        organizer: { "@id": `${siteUrl}/#organization` },
        location: {
          "@type": "Place",
          name: "Campus UPB — POLITEHNICA București",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Splaiul Independenței nr. 313",
            addressLocality: "București",
            addressCountry: "RO",
          },
        },
        image: [heroImageUrl],
        startDate: `${year}-06-22`,
        endDate: `${year}-07-17`,
        offers: {
          "@type": "Offer",
          price: "1100",
          priceCurrency: "RON",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#inscriere`,
          validFrom: `${year}-01-01`,
          description:
            "Tarif orientativ pe săptămână per copil; discount frați 20%. Include masă, materiale și asistență medicală.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
