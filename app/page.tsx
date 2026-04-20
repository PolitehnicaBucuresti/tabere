import Image from "next/image";
import {
  CalendarDays,
  Compass,
  ShieldCheck,
  Sparkles,
  Star,
  Telescope,
} from "lucide-react";

export default function Home() {
  const heroImage = "/hero-main.jpg";
  const currentYear = new Date().getFullYear();

  const schedule = [
    {
      interval: "08:30 - 09:30",
      day1: "Sosire copii",
      day2: "Sosire copii",
      day3: "Sosire copii",
      day4: "Sosire copii",
      day5: "Sosire copii",
    },
    {
      interval: "09:30 - 10:00",
      day1: "Warm-up și transfer",
      day2: "Warm-up și transfer",
      day3: "Warm-up și transfer",
      day4: "Warm-up și transfer",
      day5: "Warm-up și transfer",
    },
    {
      interval: "10:00 - 10:45",
      day1: "Marea aventură a materialelor (Știința și Ingineria Materialelor)",
      day2: "Laboratorul viitorului (FIcBi)",
      day3: "Micii cercetători. Ce se ascunde în mâncarea noastră? (ISB)",
      day4: "Magia electricității (IE)",
      day5: "Cum se mișcă lucrurile (FIMM)",
    },
    {
      interval: "10:45 - 11:15",
      day1: "Smashing hammer - activitate practică",
      day2: "Activitate practică: Sunt un mic cercetător",
      day3: "Detectivii naturii (ISB)",
      day4: "Primul meu circuit (IE)",
      day5: "Mini sisteme automate (FIMM)",
    },
    {
      interval: "11:15 - 12:15",
      day1: "Punem lumea în mișcare - simulare circuit și (Transporturi)",
      day2: "Atelier construit avioane (FIA)",
      day3: "Academia Micilor Brutari (ISB)",
      day4: "Energie verde - atelier (Energetică)",
      day5: "Atelier robotică (FIIR)",
    },
    {
      interval: "12:15 - 12:45",
      day1: "Atelier activitate practică - Orașul inteligent (Transporturi)",
      day2: "Activitate practică - Lansare (FIA)",
      day3: "Unde a dispărut ecoul - activitate practică în camera anecoică (ISB)",
      day4: "Puterea fulgerelor (Energetică)",
      day5: "Demonstrații printare 3D (FIIR)",
    },
    {
      interval: "12:45 - 13:00",
      day1: "Transfer - plimbare prin campus",
      day2: "Transfer",
      day3: "Transfer - plimbare prin campus",
      day4: "Transfer - plimbare prin campus",
      day5: "Transfer - plimbare prin campus",
    },
    {
      interval: "13:00 - 14:00",
      day1: "Prânz",
      day2: "Prânz",
      day3: "Prânz",
      day4: "Prânz",
      day5: "Prânz",
    },
    {
      interval: "14:00 - 15:30",
      day1: "Atelier creativ - pictură",
      day2: "Atelier de improvizație teatrală",
      day3: "Atelier arheologie - Vânătorii de comori",
      day4: "Workshop Euronews - Micii reporteri",
      day5: "Workshop dezbateri - Avocat pentru o zi (Facultatea de Drept)",
    },
    {
      interval: "15:30 - 16:15",
      day1: "Știința București - joc și mișcare",
      day2: "Știința București - joc și mișcare",
      day3: "Știința București - joc și mișcare",
      day4: "Știința București - joc și mișcare",
      day5: "Știința București - joc și mișcare",
    },
    {
      interval: "16:15 - 16:30",
      day1: "Gustare și hidratare",
      day2: "Gustare și hidratare",
      day3: "Gustare și hidratare",
      day4: "Gustare și hidratare",
      day5: "Gustare și hidratare",
    },
    {
      interval: "16:30 - 17:30",
      day1: "Jocuri distractive",
      day2: "Jocuri distractive",
      day3: "Jocuri distractive",
      day4: "Jocuri distractive",
      day5: "Jocuri distractive",
    },
    {
      interval: "17:30 - 18:00",
      day1: "Preluare copii",
      day2: "Preluare copii",
      day3: "Preluare copii",
      day4: "Preluare copii",
      day5: "Preluare copii",
    },
  ];

  const seriesOptions = [
    "Seria 1 - interval 08:30 - 09:30",
    "Seria 2 - interval 09:30 - 10:00",
    "Seria 3 - interval 10:00 - 10:45",
    "Seria 4 - interval 10:45 - 11:15",
  ];

  const dayPrograms = [
    { title: "Ziua 1", key: "day1" as const, icon: Sparkles },
    { title: "Ziua 2", key: "day2" as const, icon: Compass },
    { title: "Ziua 3", key: "day3" as const, icon: Star },
    { title: "Ziua 4", key: "day4" as const, icon: CalendarDays },
    { title: "Ziua 5", key: "day5" as const, icon: Telescope },
  ];

  return (
    <>
      <header className="hero" id="intro">
        <div className="floatingSet heroOrbs" aria-hidden="true">
          <span className="orb orbOne" />
          <span className="orb orbTwo" />
          <span className="orb orbThree" />
          <span className="orb orbFour" />
        </div>
        <nav className="navbar">
          <a className="brand" href="#intro">
            <Image src="/logo.svg" alt="POLI Summer Camp" width={38} height={38} />
            <span>Poli Summer Camp</span>
          </a>
          <div className="navlinks">
            <a href="#despre">Despre</a>
            <a href="#activitati">Activități</a>
            <a href="#program">Program și tarife</a>
            <a href="#inscriere">Înscriere</a>
            <a href="#locatie">Locație</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <div className="heroGrid">
          <div className="heroContent">
            <p className="tagline">Inspirație. Joacă. Distracție.</p>
            <h1>Poli Summer Camp</h1>
            <p>
              Dacă ai un copil curios, mereu dornic să învețe lucruri noi sau,
              dimpotrivă, încă nehotărât cu privire la pasiunile sale, taberele
              urbane organizate de POLITEHNICA București îl ajută să exploreze
              domenii fascinante într-un mod distractiv și sigur.
            </p>
            <div className="heroActions">
              <a className="heroButton" href="#inscriere">
                Rezervă locul în tabăra POLITEHNICA
              </a>
              <a className="heroGhostButton" href="#activitati">
                Vezi activitățile
              </a>
            </div>
          </div>
          <div className="heroVisual">
            <Image
              src={heroImage}
              alt="Copii la activități în cadrul taberei"
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className="heroImage"
              priority
            />
            <div className="heroBadge">Campus UPB</div>
          </div>
        </div>
      </header>

      <main className="container">
        <section id="despre" className="cardSection splitSection reveal">
          <div className="floatingSet sectionBubbles" aria-hidden="true">
            <span className="orb orbSmallA" />
            <span className="orb orbSmallB" />
          </div>
          <div className="aboutText">
            <h2>Despre taberele noastre</h2>
            <p>
              POLITEHNICA București lansează tabere urbane dedicate celor mai mici
              exploratori din domeniul ingineriei.
            </p>
            <p>
              Viitor inginer în industria aerospațială? Inginer energetician? Sau
              poate specialist în robotică? Inventatorul super-materialului
              viitorului? Specialist în biotehnologii alimentare? Nu putem ști
              exact cum va fi viitorul, însă un lucru este cert: ingineria va
              juca un rol principal.
            </p>
          </div>
          <aside className="miniCards benefitsPanel">
            <article>
              <h3>
                <ShieldCheck size={18} />
                Siguranță
              </h3>
              <p>Mediu atent supravegheat, prietenos și bine organizat.</p>
            </article>
            <article>
              <h3>
                <Compass size={18} />
                Explorare
              </h3>
              <p>Ateliere practice care transformă curiozitatea în pasiune.</p>
            </article>
            <article>
              <h3>
                <Sparkles size={18} />
                Viitor
              </h3>
              <p>Primele experiențe reale cu domenii moderne de inginerie.</p>
            </article>
          </aside>
        </section>

        <section id="activitati" className="cardSection reveal">
          <div className="activityGrid">
            <div className="activityText">
              <h2>Activități</h2>
              <p>
                Taberele noastre urbane sunt structurate astfel încât copiii să
                învețe prin experiență directă, joc și experiment, alături de
                profesori și studenți pasionați, într-un mediu sigur și prietenos.
              </p>
              <ul className="featureList">
                <li>Descoperă concepte de bază din inginerie prin experimente captivante.</li>
                <li>Construiesc și testează propriile proiecte.</li>
                <li>Explorează laboratoare moderne și tehnologii reale.</li>
                <li>Leagă prietenii noi cu alți copii curioși.</li>
                <li>Participă la activități recreative și educative pentru echilibru.</li>
                <li>Câștigă încredere în propriile abilități și inspirație pentru viitor.</li>
              </ul>
            </div>
            <div className="imagePlaceholderGrid">
              <figure className="imageCard">
                <Image
                  src="/atelier-copii-1.png"
                  alt="Copii participând la atelier practic"
                  fill
                  sizes="(max-width: 768px) 100vw, 26vw"
                  className="sectionImage"
                />
              </figure>
              <figure className="imageCard">
                <Image
                  src="/atelier-copii-2.jpg"
                  alt="Atelier educativ pentru copii"
                  fill
                  sizes="(max-width: 768px) 100vw, 26vw"
                  className="sectionImage"
                />
              </figure>
            </div>
          </div>
        </section>

        <section id="program" className="cardSection reveal">
          <h2>Program și tarife</h2>
          <p>
            Programul îmbină activitățile educaționale cu momente de joacă și
            relaxare, într-un mediu sigur și prietenos. Tarifele includ toate
            activitățile, materialele necesare și mesele zilnice.
          </p>
          <p className="notice">
            Tarifele vor fi actualizate după comunicarea finală din partea
            organizatorilor.
          </p>
          <div className="dayTabs">
            {dayPrograms.map((day) => {
              const Icon = day.icon;
              return (
                <article key={day.key} className="dayCard">
                  <h3>
                    <Icon size={18} />
                    {day.title}
                  </h3>
                  <ul>
                    {schedule.map((item) => (
                      <li key={`${day.key}-${item.interval}`}>
                        <span>{item.interval}</span>
                        <p>{item[day.key]}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section id="inscriere" className="cardSection reveal">
          <h2>Înscriere</h2>
          <p>
            Completează formularul pentru a rezerva locul. După trimitere, vei
            fi contactat de echipa noastră pentru confirmare și detalii.
          </p>
          <p>Locurile sunt limitate pentru fiecare serie.</p>

          <form className="signupForm">
            <fieldset>
              <legend>Date părinte</legend>
              <label>
                Nume și prenume părinte
                <input type="text" name="parentName" required />
              </label>
              <label>
                Telefon
                <input type="tel" name="phone" required />
              </label>
              <label>
                E-mail
                <input type="email" name="email" required />
              </label>
            </fieldset>

            <fieldset>
              <legend>Date copil</legend>
              <label>
                Nume și prenume copil
                <input type="text" name="childName" required />
              </label>
              <label>
                Vârsta copilului
                <input type="number" name="age" min={5} max={18} required />
              </label>
              <label>
                Școala unde este înscris
                <input type="text" name="school" required />
              </label>
            </fieldset>

            <fieldset>
              <legend>Alegerea programului</legend>
              {seriesOptions.map((option) => (
                <label key={option} className="checkboxLabel">
                  <input type="radio" name="series" value={option} required />
                  {option}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Informații importante</legend>
              <label>
                Alergii sau afecțiuni medicale (dacă este cazul)
                <textarea name="medicalInfo" rows={4} />
              </label>
            </fieldset>

            <label className="checkboxLabel">
              <input type="checkbox" name="gdpr" required />
              Sunt de acord cu prelucrarea datelor personale pentru înscrierea în
              tabără.
            </label>

            <button type="submit">Înscrie copilul</button>
          </form>

          <p className="legalNote">
            Datele completate sunt utilizate exclusiv pentru organizarea taberei
            și comunicarea cu părinții. Informațiile sunt tratate confidențial
            și în conformitate cu legislația privind protecția datelor.
          </p>
          <p className="legalNote">
            Ne rezervăm dreptul de a modifica tematicile atelierelor în funcție
            de disponibilitatea profesorilor și a locațiilor.
          </p>
        </section>

        <section id="locatie" className="cardSection reveal">
          <h2>Locație</h2>
          <p>
            Taberele se desfășoară în campusul modern al Universității Naționale
            de Știință și Tehnologie POLITEHNICA București, un spațiu sigur,
            verde și dedicat învățării.
          </p>
          <p className="notice">
            Galeria foto va fi adăugată imediat ce imaginile sunt disponibile.
          </p>
          <div className="locationGallery">
            <figure className="imageCard wide">
              <Image
                src="/campus-poli.jpg"
                alt="Campus POLITEHNICA București"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="sectionImage"
              />
            </figure>
            <figure className="imageCard emphasizeMiddle">
              <Image
                src="/ss-campus.png"
                alt="Campus POLITEHNICA București"
                fill
                sizes="(max-width: 768px) 100vw, 28vw"
                className="sectionImage"
              />
            </figure>
            <figure className="imageCard">
              <Image
                src="/despre_noi.jpg"
                alt="Copii în activități educative la POLI Summer Camp"
                fill
                sizes="(max-width: 768px) 100vw, 28vw"
                className="sectionImage"
              />
            </figure>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <a className="brand footerBrandLink" href="#intro">
              <Image src="/logo.svg" alt="POLI Summer Camp" width={34} height={34} />
              <span>Poli Summer Camp</span>
            </a>
            <p>Inspirație. Joacă. Distracție.</p>
            <p>Splaiul Independenței nr. 313, București</p>
            <a href="mailto:marketing@upb.ro">marketing@upb.ro</a>
          </div>

          <div className="footerColumn">
            <h3>Navigare</h3>
            <a href="#despre">Despre</a>
            <a href="#activitati">Activități</a>
            <a href="#program">Program și tarife</a>
            <a href="#inscriere">Înscriere</a>
          </div>

          <div className="footerColumn">
            <h3>Informații</h3>
            <a href="#locatie">Locație</a>
            <a href="#contact">Contact</a>
            <a href="#intro">Înapoi sus</a>
          </div>
        </div>
        <p className="copyright">
          © {currentYear} Poli Summer Camp. Toate drepturile rezervate.
        </p>
      </footer>
    </>
  );
}
