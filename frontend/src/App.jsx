import { useEffect, useState } from "react";

const emptyPortfolio = {
  navigation: [],
  hero: {},
  about: {},
  statsSection: { items: [] },
  skillsSection: { items: [] },
  experienceSection: { items: [] },
  projectsSection: { items: [] },
  contact: { links: [] }
};

function normalizeDetailLines(content) {
  if (Array.isArray(content)) {
    return content.filter(Boolean);
  }

  if (typeof content === "string") {
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}

function ensureArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeActionLinks(hero = {}) {
  if (Array.isArray(hero.actions) && hero.actions.length) {
    return hero.actions.filter((action) => action?.label && action?.href);
  }

  return [
    {
      label: hero.primaryCtaLabel,
      href: hero.primaryCtaLink,
      variant: "primary"
    },
    {
      label: hero.secondaryCtaLabel,
      href: hero.secondaryCtaLink,
      variant: "secondary"
    }
  ].filter((action) => action.label && action.href);
}

function normalizeContactLinks(contact = {}) {
  if (Array.isArray(contact.links) && contact.links.length) {
    return contact.links.filter((link) => link?.label && link?.href);
  }

  return [
    contact.email
      ? { label: contact.email, href: `mailto:${contact.email}` }
      : null,
    contact.linkedin ? { label: "LinkedIn", href: contact.linkedin } : null,
    contact.github ? { label: "GitHub", href: contact.github } : null,
    contact.resumeLink ? { label: "Resume", href: contact.resumeLink } : null
  ].filter(Boolean);
}

function normalizeSection(section = {}, fallback = {}) {
  return {
    id: section.id ?? fallback.id ?? "",
    label: section.label ?? fallback.label ?? "",
    heading: section.heading ?? fallback.heading ?? "",
    description: section.description ?? fallback.description ?? "",
    items: ensureArray(section.items ?? fallback.items)
  };
}

function normalizePortfolio(rawPortfolio = {}) {
  const about = {
    id: rawPortfolio.about?.id ?? "about",
    label: rawPortfolio.about?.label ?? "About",
    heading: rawPortfolio.about?.heading ?? "",
    description: rawPortfolio.about?.description ?? ""
  };

  const statsSection = normalizeSection(rawPortfolio.statsSection, {
    id: "stats",
    label: "Highlights",
    items: rawPortfolio.stats
  });

  const skillsSection = normalizeSection(rawPortfolio.skillsSection, {
    id: "skills",
    label: "Skills",
    heading: "Capabilities",
    items: rawPortfolio.skills
  });

  const experienceSection = normalizeSection(rawPortfolio.experienceSection, {
    id: "experience",
    label: "Experience",
    heading: "Work that shaped my development style",
    items: rawPortfolio.experience
  });

  const projectsSection = normalizeSection(rawPortfolio.projectsSection, {
    id: "projects",
    label: "Projects",
    heading: "Selected builds with room to grow",
    items: rawPortfolio.projects
  });

  const contact = {
    id: rawPortfolio.contact?.id ?? "contact",
    label: rawPortfolio.contact?.label ?? "Contact",
    heading: rawPortfolio.contact?.heading ?? "",
    description: rawPortfolio.contact?.description ?? "",
    links: normalizeContactLinks(rawPortfolio.contact)
  };

  const navigation = Array.isArray(rawPortfolio.navigation) && rawPortfolio.navigation.length
    ? rawPortfolio.navigation.filter((item) => item?.label && item?.href)
    : [
        { label: about.label, href: `#${about.id}` },
        { label: experienceSection.label, href: `#${experienceSection.id}` },
        { label: projectsSection.label, href: `#${projectsSection.id}` },
        { label: contact.label, href: `#${contact.id}` }
      ];

  return {
    navigation,
    hero: {
      ...rawPortfolio.hero,
      focusAreas: ensureArray(rawPortfolio.hero?.focusAreas),
      actions: normalizeActionLinks(rawPortfolio.hero)
    },
    about,
    statsSection,
    skillsSection,
    experienceSection: {
      ...experienceSection,
      items: experienceSection.items.map((item) => ({
        ...item,
        highlights: ensureArray(item?.highlights)
      }))
    },
    projectsSection: {
      ...projectsSection,
      items: projectsSection.items.map((item) => ({
        ...item,
        stack: ensureArray(item?.stack)
      }))
    },
    contact
  };
}

function App() {
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [status, setStatus] = useState("loading");
  const [openExperience, setOpenExperience] = useState(0);
  const [openProject, setOpenProject] = useState(0);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        const data = await response.json();
        setPortfolio(normalizePortfolio(data));
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

  const {
    navigation,
    hero,
    about,
    statsSection,
    skillsSection,
    experienceSection,
    projectsSection,
    contact
  } = portfolio;

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="hero">
        <nav className="topbar">
          <div className="brand">{hero.brand}</div>
          <div className="nav-links">
            {navigation.map((item) => (
              <a href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.name}</h1>
            <p className="hero-title">{hero.title}</p>
            <p className="hero-summary">{hero.summary}</p>

            <div className="hero-actions">
              {hero.actions.map((action) => (
                <a
                  className={`button button-${action.variant ?? "secondary"}`}
                  href={action.href}
                  key={`${action.label}-${action.href}`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-label">Current Focus</p>
            <h2>{hero.focusTitle}</h2>
            <p>{hero.focusSummary}</p>
            <ul className="focus-list">
              {hero.focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <main className="content">
        <section id={about.id} className="section section-grid">
          <div>
            <p className="section-label">{about.label}</p>
            <h2>{about.heading}</h2>
          </div>
          <div className="card">
            <p>{about.description}</p>
          </div>
        </section>

        <StatsSection section={statsSection} />
        <SkillsSection section={skillsSection} />

        <AccordionSection
          section={experienceSection}
          openIndex={openExperience}
          onToggle={setOpenExperience}
          getKey={(item) => `${item.company}-${item.role}-${item.period}`}
          renderHeader={(item) => (
            <div className="timeline-head">
              <div>
                <p className="accordion-kicker">{item.company}</p>
                <h3>{item.role}</h3>
              </div>
              <span className="timeline-period">{item.period}</span>
            </div>
          )}
          renderSummary={(item) => item.description}
          renderPanel={(item) => (
            <>
              <DetailList content={item.descriptions ?? item.details} />
              <TagRow items={item.highlights} />
            </>
          )}
          contentClassName="timeline"
          itemClassName="timeline-item card"
        />

        <AccordionSection
          section={projectsSection}
          openIndex={openProject}
          onToggle={setOpenProject}
          getKey={(item) => item.title}
          renderHeader={(item) => (
            <div className="project-top">
              <span className="project-type">{item.type}</span>
              <h3>{item.title}</h3>
            </div>
          )}
          renderSummary={(item) => item.description}
          renderPanel={(item) => (
            <>
              <DetailList content={item.details} />
              <TagRow items={item.stack} />
              <LinkRow links={item.links} fallbackLinks={projectFallbackLinks(item)} />
            </>
          )}
          contentClassName="project-grid project-accordion"
          itemClassName="project-card"
        />

        <section id={contact.id} className="section contact-section">
          <div>
            <p className="section-label">{contact.label}</p>
            <h2>{contact.heading}</h2>
            <p>{contact.description}</p>
          </div>

          <div className="contact-card card">
            {contact.links.map((link) => (
              <a href={link.href} key={`${link.label}-${link.href}`}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatsSection({ section }) {
  if (!section.items.length) {
    return null;
  }

  return (
    <section className="stats-grid" aria-label={section.label}>
      {section.items.map((item) => (
        <article className="stat-card" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}

function SkillsSection({ section }) {
  if (!section.items.length) {
    return null;
  }

  return (
    <section id={section.id} className="section">
      <p className="section-label">{section.label}</p>
      {section.heading ? <h2 className="section-title">{section.heading}</h2> : null}
      {section.description ? <p className="section-intro">{section.description}</p> : null}
      <div className="skill-cloud">
        {section.items.map((skill) => (
          <span className="skill-pill" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function AccordionSection({
  section,
  openIndex,
  onToggle,
  getKey,
  renderHeader,
  renderSummary,
  renderPanel,
  contentClassName,
  itemClassName
}) {
  if (!section.items.length) {
    return null;
  }

  return (
    <section id={section.id} className="section">
      <div className="section-heading">
        <div>
          <p className="section-label">{section.label}</p>
          <h2>{section.heading}</h2>
          {section.description ? <p className="section-intro">{section.description}</p> : null}
        </div>
      </div>

      <div className={contentClassName}>
        {section.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              className={`${itemClassName} accordion-item ${isOpen ? "is-open" : ""}`}
              key={getKey(item)}
            >
              <button
                className="accordion-trigger"
                type="button"
                onClick={() => onToggle(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                {renderHeader(item)}

                <div className="accordion-meta">
                  <p className="accordion-summary multiline-text">{renderSummary(item)}</p>
                  <span className="accordion-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
              </button>

              {isOpen ? <div className="accordion-panel">{renderPanel(item)}</div> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DetailList({ content }) {
  const details = normalizeDetailLines(content);

  if (!details.length) {
    return null;
  }

  return (
    <ul className="detail-list">
      {details.map((detail) => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  );
}

function TagRow({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="tag-row">
      {items.map((item) => (
        <span className="tag" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function LinkRow({ links, fallbackLinks = [] }) {
  const resolvedLinks = Array.isArray(links) && links.length
    ? links.filter((link) => link?.label && link?.href)
    : fallbackLinks;

  if (!resolvedLinks.length) {
    return null;
  }

  return (
    <div className="project-links">
      {resolvedLinks.map((link) => (
        <a href={link.href} key={`${link.label}-${link.href}`}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function projectFallbackLinks(project) {
  return [
    project.liveLink ? { label: "Live Demo", href: project.liveLink } : null,
    project.repoLink ? { label: "Repository", href: project.repoLink } : null
  ].filter(Boolean);
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
