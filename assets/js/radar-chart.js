// Renders an SVG radar/polygon chart into each [data-radar] element from its
// data-skills JSON payload ([{name, value}], value 0-100). Plain trig, no
// charting library — this is the one place Liquid genuinely can't help
// (no sin/cos in stock Jekyll/Liquid), so it's computed client-side.
export function initRadarCharts() {
  document.querySelectorAll('[data-radar]').forEach(render);
}

function render(el) {
  let skills;
  try {
    skills = JSON.parse(el.dataset.radar);
  } catch (e) {
    return;
  }
  if (!Array.isArray(skills) || !skills.length) return;

  const size = 220;
  const center = size / 2;
  const maxR = size / 2 - 28;
  const n = skills.length;
  const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i, r) => {
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };

  const gridRings = [0.25, 0.5, 0.75, 1].map((f) => {
    const pts = skills.map((_, i) => pointAt(i, maxR * f).join(',')).join(' ');
    return `<polygon class="radar-grid-line" points="${pts}" />`;
  });

  const axisLines = skills
    .map((_, i) => {
      const [x, y] = pointAt(i, maxR);
      return `<line class="radar-grid-line" x1="${center}" y1="${center}" x2="${x}" y2="${y}" />`;
    })
    .join('');

  const labels = skills
    .map((s, i) => {
      const [x, y] = pointAt(i, maxR + 16);
      const anchor = Math.abs(x - center) < 4 ? 'middle' : x > center ? 'start' : 'end';
      return `<text class="radar-axis-label" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(s.name)}</text>`;
    })
    .join('');

  const dataPoints = skills.map((s, i) => pointAt(i, (maxR * s.value) / 100).join(',')).join(' ');

  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Skill radar chart: ${skills
      .map((s) => `${s.name} ${s.value} out of 100`)
      .join(', ')}">
      ${gridRings.join('')}
      ${axisLines}
      <polygon class="radar-fill" points="${dataPoints}" />
      ${labels}
    </svg>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
