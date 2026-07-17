export function initScrollReveal() {
  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const remaining = new Set(targets);
  const reveal = (el) => {
    el.classList.add('is-visible');
    remaining.delete(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    // Generous rootMargin so content starts revealing well before it's
    // fully in view — keeps this reliable even under a very fast scroll.
    { threshold: 0.1, rootMargin: '200px 0px -5% 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Safety net: IntersectionObserver can, in principle, miss an element
  // that's scrolled past faster than the browser samples intersections
  // (e.g. an extreme trackpad fling or repeated Page Down). Content should
  // never be permanently stuck invisible, so periodically sweep for any
  // still-hidden element that's already above the fold and reveal it.
  let ticking = false;
  const sweep = () => {
    ticking = false;
    if (!remaining.size) return;
    remaining.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        reveal(el);
        observer.unobserve(el);
      }
    });
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking && remaining.size) {
        ticking = true;
        requestAnimationFrame(sweep);
      }
    },
    { passive: true }
  );
}
