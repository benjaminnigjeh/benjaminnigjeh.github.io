// Reusable tag-filter behavior. Any container with [data-filter-group] gets
// wired: its .filter-btn[data-filter] buttons toggle visibility of sibling
// [data-filter-target] cards whose [data-tags] (space-separated) contains
// the selected filter value. "all" (the default-active button) shows everything.
export function initFilterableLists() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const targetSelector = group.dataset.filterGroup;
    const buttons = group.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll(targetSelector);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(' ');
          const show = filter === 'all' || tags.includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });
}
