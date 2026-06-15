 "use client";

import Image from "next/image";
import { useState } from "react";
import { INSCRIPTION_CLOSED_MESSAGE } from "@/lib/inscription-constants";
import {
  Clock3,
  Compass,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import MouseAura from "./components/MouseAura";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="siteWrap">
      <a href="#main-content" className="skipLink">
        Salt la conținutul principal
      </a>
      <header className="heroPanel" id="intro">
        <MouseAura targetId="intro" />
        <nav className="topNav">
          <div className="topNavRow">
            <a className="brand" href="#intro" onClick={() => setMenuOpen(false)}>
              <span className="brandLogoWrap">
                <Image src="/Logo_RO_PB(ALB)2.svg" alt="Taberele Micilor Ingineri" width={60} height={60} />
              </span>
              <span>Taberele Micilor Ingineri</span>
            </a>
            <button
              type="button"
              className={`navToggle ${menuOpen ? "isOpen" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="site-nav-links"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div id="site-nav-links" className={`navPills ${menuOpen ? "isOpen" : ""}`}>
            <a href="#despre" onClick={() => setMenuOpen(false)}>Despre</a>
            <a href="#activitati" onClick={() => setMenuOpen(false)}>Activități</a>
            <a href="#program" onClick={() => setMenuOpen(false)}>Program</a>
            <a href="#inscriere" onClick={() => setMenuOpen(false)}>Înscriere</a>
            <a href="#sponsori" onClick={() => setMenuOpen(false)}>Sponsori</a>
            <a href="#locatie" onClick={() => setMenuOpen(false)}>Locație</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        </nav>

        <div className="heroSplit">
          <div className="heroCopy">
            <p className="overline">Inspirație. Joacă. Distracție.</p>
            <h1>Tabăra de vară unde curiozitatea copiilor devine superputere.</h1>
            <p>
              POLITEHNICA București creează un spațiu sigur în care copiii descoperă
              ingineria prin joc, experimente și activități memorabile, alături de mentori pasionați.
            </p>
            <div className="heroCtas">
              <a href="#inscriere" className="btnPrimary">Informații înscriere</a>
              <a href="#activitati" className="btnSoft">Vezi activitățile</a>
            </div>
            <div className="heroMeta">
              <span><Clock3 size={16} /> 08:30 - 18:00</span>
              <span><Users size={16} /> pentru copii între 5-11 ani</span>
            </div>
          </div>

          <div className="heroVisualStack">
            <figure className="heroMainImage">
              <Image src="/8.close-up-smiley-kids-team.jpg" alt="Copii la activități în cadrul taberei" fill priority sizes="(max-width: 900px) 100vw, 46vw" />
            </figure>
            <div className="heroBadgeCard">
              <p>Program pilot</p>
              <strong>TABERELE MICILOR INGINERI</strong>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="contentGrid">
        <section id="despre" className="sectionCard">
          <div className="aboutMosaic">
            <article className="aboutText">
              <h2>Despre taberele noastre</h2>
              <p className="leadText">
                Pentru copii care pun întrebări, desfac jucării să vadă cum funcționează
                și își imaginează viitorul cu entuziasm.
              </p>
              <p>
                Viitor inginer în industria aerospațială? Inginer energetician? Sau poate specialist
                în robotică, materiale inovatoare ori biotehnologii alimentare? Nu putem ști exact
                cum va arăta viitorul, însă știm sigur că ingineria va avea un rol principal.
              </p>
            </article>
            <figure className="mediaCard mediaCardGlow">
              <Image src="/3.kids-using-electronic-parts-build-robot.jpg" alt="Copii în activități educative la Taberele Micilor Ingineri" fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectPosition: "center 15%" }} />
            </figure>
            {/* <div className="aboutSticker">
              <Sparkles size={16} />
              <span>100% learning by doing</span>
            </div> */}
            <div className="benefitList">
              <article><h3><ShieldCheck size={18} /> Siguranță</h3><p>Mediu supravegheat, prietenos, dedicat învățării.</p></article>
              <article><h3><Compass size={18} /> Explorare</h3><p>Ateliere practice care dezvoltă creativitatea și logica.</p></article>
              <article><h3><Sparkles size={18} /> Viitor</h3><p>Primele contacte reale cu lumea fascinantă a ingineriei.</p></article>
            </div>
          </div>
        </section>

        <section id="activitati" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Activități</h2>
            <span className="chip">Învățare prin experiență directă</span>
          </div>
          <div className="activitiesShowcase">
            <article className="activitiesNarrative">
              <p>
                Fiecare zi în tabără combină experimentul, jocul și explorarea, astfel încât copiii
                să învețe natural, cu entuziasm și încredere.
              </p>
              <div className="activitiesPillars">
                <article>
                  <h3><Sparkles size={17} /> Experimente</h3>
                  <p>Copiii descoperă concepte de inginerie prin activități practice și captivante.</p>
                </article>
                <article>
                  <h3><Users size={17} /> Colaborare</h3>
                  <p>Lucrează în echipă, își dezvoltă comunicarea și creează proiecte împreună.</p>
                </article>
                <article>
                  <h3><Compass size={17} /> Explorare</h3>
                  <p>Vizitează laboratoare moderne și testează idei noi într-un mediu sigur.</p>
                </article>
              </div>
            </article>

            <div className="activitiesMosaic">
              <figure className="mediaCard mediaCardGlow activityA">
                <Image src="/1.children-using-building-kit.jpg" alt="Copii participând la atelier practic" fill sizes="(max-width: 900px) 100vw, 34vw" />
              </figure>
              <figure className="mediaCard mediaCardGlow activityB">
                <Image src="/5.schoolchildren-working-with-experiment.jpg" alt="Atelier educativ pentru copii" fill sizes="(max-width: 900px) 100vw, 26vw" />
              </figure>
              <figure className="mediaCard mediaCardGlow activityC">
                <Image src="/6.kids-interacting-with-plasma-ball.jpg" alt="Copii explorând experimente științifice în tabără" fill sizes="(max-width: 900px) 100vw, 22vw" />
              </figure>
              {/* <div className="activitySticker">
                <span>+ joacă</span>
                <span>+ știință</span>
                <span>+ prietenie</span>
              </div> */}
            </div>
          </div>
        </section>

        <section id="program" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Program</h2>
          </div>
          <p className="programComingSoon">
            Programul activităților va fi actualizat în scurt timp.
          </p>
        </section>

        <section id="inscriere" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Înscriere</h2>
          </div>
          <p className="inscriptionClosedNotice" role="status">
            {INSCRIPTION_CLOSED_MESSAGE}
          </p>
        </section>

        <section id="sponsori" className="sponsorsSection" aria-labelledby="sponsori-heading">
          <div className="sponsorsInner">
            <p className="sponsorsOverline">Parteneri</p>
            <h2 id="sponsori-heading">Sponsori</h2>
            <p className="sponsorsLead">
              Taberele Micilor Ingineri sunt posibile și cu sprijinul partenerilor noștri.
            </p>
            <ul className="sponsorsList">
              <li>
                <a
                  href="https://sanovita.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsorCard"
                  aria-label="SanoVita — site partener (se deschide într-un tab nou)"
                >
                  <span className="sponsorLogoWrap">
                    <Image
                      src="/logo_sanovita.png"
                      alt="Logo SanoVita"
                      width={220}
                      height={88}
                      className="sponsorLogo"
                    />
                  </span>
                  <span className="sponsorName">SanoVita</span>
                  <span className="sponsorLinkHint">sanovita.ro</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section id="locatie" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Locație</h2>
            <span className="chip"><MapPin size={15} /> Campus UPB</span>
          </div>
          <p className="locationDescription" style={{ fontSize: '14px' }}>
            Taberele se desfășoară în campusul modern al Universității Naționale de Știință
            și Tehnologie POLITEHNICA București, un spațiu sigur, verde și dedicat învățării.
          </p>
     
          <div className="locationCollage collageCreative">
            <figure className="mediaCard wide mediaCardGlow"><Image src="/campus-poli.jpg" alt="Campus POLITEHNICA București" fill sizes="(max-width: 900px) 100vw, 38vw" /></figure>
            <figure className="mediaCard mediaCardGlow"><Image src="/ss-campus.png" alt="Campus POLITEHNICA București" fill sizes="(max-width: 900px) 100vw, 30vw" /></figure>
            <figure className="mediaCard mediaCardGlow"><Image src="/despre_noi.jpg" alt="Copii în activități educative la Taberele Micilor Ingineri" fill sizes="(max-width: 900px) 100vw, 30vw" /></figure>
          </div>
          <div className="locationFacts">
            <span>Spații moderne</span>
            <span>Zonă verde extinsă</span>
            <span>Acces facil în București</span>
          </div>
        </section>
      </main>

      <footer id="contact" className="siteFooter">
        <div className="footerInner">
          <div className="footerBrand">
            <a className="brand footerBrandLink" href="#intro">
              <span className="brandLogoWrap">
                <Image src="/Logo_RO_PB(ALB)2.svg" alt="Taberele Micilor Ingineri" width={60} height={60} />
              </span>
              <span>Taberele Micilor Ingineri</span>
            </a>
            <p>Inspirație. Joacă. Distracție.</p>
            <p>Splaiul Independenței nr. 313, București</p>
            <a href="mailto:marketing@upb.ro"><Mail size={15} /> marketing@upb.ro</a>
          </div>

          <div className="footerColumn">
            <h3>Pagini</h3>
            <a href="#despre">Despre</a>
            <a href="#activitati">Activități</a>
            <a href="#program">Program</a>
            <a href="#inscriere">Înscriere</a>
            <a href="#sponsori">Sponsori</a>
            <a href="#locatie">Locație</a>
          </div>

          <div className="footerColumn">
            <h3>Acces rapid</h3>
            <a href="#sponsori">Sponsori</a>
            <a href="#locatie">Locație</a>
            <a href="#contact">Contact</a>
            <a href="#intro">Înapoi sus</a>
          </div>
        </div>
        <p className="copyright">© {currentYear} Taberele Micilor Ingineri. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}
