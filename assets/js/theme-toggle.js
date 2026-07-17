export function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Dark is the default regardless of OS preference — see _sass/_tokens.scss.
  const current = () => document.documentElement.getAttribute('data-theme') || 'dark';

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* localStorage unavailable (private mode) — theme just won't persist */
    }
    btn.setAttribute('aria-pressed', String(next === 'light'));
  });
}
