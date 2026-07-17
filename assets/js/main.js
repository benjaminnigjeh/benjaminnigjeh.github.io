import { initThemeToggle } from './theme-toggle.js';
import { initParticles } from './particles.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initCounters } from './counters.js';
import { initCommandPalette } from './command-palette.js';
import { initFilterableLists } from './filterable-list.js';
import { initResearchGraph } from './research-graph.js';
import { initGithubActivity } from './github-activity.js';
import { initRadarCharts } from './radar-chart.js';

initThemeToggle();
initScrollReveal();
initCounters();
initCommandPalette();
initFilterableLists();
initParticles('hero-particles');
initResearchGraph('research-ecosystem-graph');
initGithubActivity('github-repo-grid', 'benjaminnigjeh');
initRadarCharts();
initScrollProgress();
initBackToTop();
initPipelinePlay();
initEasterEgg();

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    bar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  document.addEventListener(
    'scroll',
    () => btn.classList.toggle('is-visible', window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initPipelinePlay() {
  const track = document.querySelector('.pipeline-track');
  if (!track || !('IntersectionObserver' in window)) {
    if (track) track.classList.add('is-playing');
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          track.classList.add('is-playing');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(track);
}

function initEasterEgg() {
  console.log(
    '%cLooking at the source? Let\'s talk about AI-native proteomics.',
    'color:#7c9cff;font-weight:bold;font-size:13px;'
  );
  console.log('%cbenjamin.nigjeh@gmail.com', 'color:#4fd1c5;font-size:12px;');

  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let progress = 0;
  document.addEventListener('keydown', (e) => {
    progress = e.key === sequence[progress] ? progress + 1 : 0;
    if (progress === sequence.length) {
      progress = 0;
      document.body.classList.add('easter-egg-active');
      setTimeout(() => document.body.classList.remove('easter-egg-active'), 3000);
    }
  });
}
