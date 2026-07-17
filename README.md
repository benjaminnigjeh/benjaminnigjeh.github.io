# benjaminnigjeh.github.io

Personal site for **Benjamin Nigjeh** — AI Scientist building intelligent systems for
protein mass spectrometry and computational proteomics.

**Live:** https://benjaminnigjeh.github.io/

## What's here

A static Jekyll site (GitHub Pages) covering:

- **Home** — hero, an interactive D3 "Research Ecosystem" graph, publications, career
  timeline, skills, and a stats dashboard.
- **AI Research Portfolio** (`/portfolio.html`) — the ProteoAgent architecture, the
  analytical MS pipeline, and case studies for the AI/ML projects.
- **CV** (`/cv.html`) — a printable HTML CV, plus a downloadable PDF version.

## Stack

Jekyll + hand-written SCSS (no CSS framework) and vanilla ES6 modules, with D3.js
loaded lazily for the research graph. No build tooling beyond Jekyll/Sass — everything
runs natively on GitHub Pages.

## Structure

```
_data/          content as data — profile, timeline, publications, projects, cv_skills
_includes/      page sections (hero, nav, research ecosystem, timeline, contact, ...)
_layouts/       page shell (default.html)
_sass/          SCSS partials, imported by assets/css/style.scss
assets/js/      theme toggle, particles, scroll reveal, research graph, counters, ...
index.html      homepage
portfolio.html  AI Research Portfolio page
cv.html         printable CV page
```

Most content (name, contact links, career history, publications, AI projects, stats)
lives in `_data/*.yml`, so updating content is usually a data edit, not a template change.

## Local development

```
bundle install
bundle exec jekyll serve
```

## Deployment

Pushes to `main` build and deploy automatically via
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) (GitHub Actions → Pages).
