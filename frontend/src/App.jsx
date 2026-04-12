import { useEffect, useState } from "react";

const emptyPortfolio = {
  hero: {},
  about: {},
  stats: [],
  skills: [],
  experience: [],
  projects: [],
  contact: {}
};

function App() {
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        const data = await response.json();
        setPortfolio(data);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
        setStatus("error");
      }
    }

    loadPortfolio();
  }, []);

  if (status === "loading") {
    return <ScreenMessage title="Loading portfolio..." />;
  }

  if (status === "error") {
    return (
      <ScreenMessage title="Unable to load portfolio">
        Please start the backend server and try again.
      </ScreenMessage>
    );
  }

  const { hero, about, stats, skills, experience, projects, contact } = portfolio;

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="hero">
        <nav className="topbar">
          <div className="brand">{hero.brand}</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.name}</h1>
            <p className="hero-title">{hero.title}</p>
            <p className="hero-summary">{hero.summary}</p>

            <div className="hero-actions">
              <a className="button button-primary" href={hero.primaryCtaLink}>
                {hero.primaryCtaLabel}
              </a>
              <a className="button button-secondary" href={hero.secondaryCtaLink}>
                {hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-label">Current Focus</p>
            <h2>{hero.focusTitle}</h2>
            <p>{hero.focusSummary}</p>
            <ul className="focus-list">
              {hero.focusAreas?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <main className="content">
        <section id="about" className="section section-grid">
          <div>
            <p className="section-label">About</p>
            <h2>{about.heading}</h2>
          </div>
          <div className="card">
            <p>{about.description}</p>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((item) => (
            <article className="stat-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="section">
          <p className="section-label">Skills</p>
          <div className="skill-cloud">
            {skills.map((skill) => (
              <span className="skill-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-heading">
            <div>
              <p className="section-label">Experience</p>
              <h2>Work that shaped my development style</h2>
            </div>
          </div>

          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item card" key={`${item.company}-${item.role}`}>
                <div className="timeline-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="muted">{item.company}</p>
                  </div>
                  <span className="timeline-period">{item.period}</span>
                </div>
                <p>{item.description}</p>
                <div className="tag-row">
                  {item.highlights.map((highlight) => (
                    <span className="tag" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-heading">
            <div>
              <p className="section-label">Projects</p>
              <h2>Selected builds with room to grow</h2>
            </div>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-top">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="tag-row">
                  {project.stack.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a href={project.liveLink}>Live Demo</a>
                  <a href={project.repoLink}>Repository</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div>
            <p className="section-label">Contact</p>
            <h2>{contact.heading}</h2>
            <p>{contact.description}</p>
          </div>

          <div className="contact-card card">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.linkedin}>LinkedIn</a>
            <a href={contact.github}>GitHub</a>
            <a href={contact.resumeLink}>Resume</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function ScreenMessage({ title, children }) {
  return (
    <div className="screen-message">
      <h1>{title}</h1>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export default App;
