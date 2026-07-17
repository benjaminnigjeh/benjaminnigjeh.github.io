// Ctrl+K command palette: lists in-page sections (collected from top-level
// [id] landmarks inside <main> — the id lives on the <section>, not the
// heading, so this reads each section's own h2/h3 for the label) plus the
// site's top-level pages. Vanilla JS, substring filter, arrow-key + Enter
// navigation — no fuzzy-search library.
const STATIC_PAGES = [
  { label: 'Home', href: '/' },
  { label: 'AI Research Portfolio', href: '/portfolio.html' },
  { label: 'CV', href: '/cv.html' },
];

export function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const trigger = document.getElementById('palette-trigger');
  const input = document.getElementById('palette-input');
  const resultsEl = document.getElementById('palette-results');
  if (!palette || !trigger || !input || !resultsEl) return;

  const sectionItems = Array.from(document.querySelectorAll('main [id], footer[id]'))
    .map((el) => {
      const heading = el.querySelector('h2, h3');
      return heading ? { label: heading.textContent.trim(), href: `${location.pathname}#${el.id}` } : null;
    })
    .filter(Boolean);

  const items = [...sectionItems, ...STATIC_PAGES];
  let filtered = items;
  let activeIndex = 0;

  function render() {
    resultsEl.innerHTML = '';
    filtered.forEach((item, i) => {
      const li = document.createElement('li');
      li.textContent = item.label;
      li.setAttribute('role', 'option');
      li.className = i === activeIndex ? 'is-active' : '';
      li.addEventListener('mouseenter', () => {
        activeIndex = i;
        render();
      });
      li.addEventListener('click', () => go(item));
      resultsEl.appendChild(li);
    });
  }

  function go(item) {
    close();
    window.location.href = item.href;
  }

  function open() {
    palette.hidden = false;
    input.value = '';
    filtered = items;
    activeIndex = 0;
    render();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    palette.hidden = true;
    trigger.focus();
  }

  trigger.addEventListener('click', open);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === 'Escape' && !palette.hidden) {
      close();
    }
  });

  palette.querySelectorAll('[data-palette-close]').forEach((el) =>
    el.addEventListener('click', close)
  );

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    filtered = items.filter((i) => i.label.toLowerCase().includes(q));
    activeIndex = 0;
    render();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      go(filtered[activeIndex]);
    }
  });
}
