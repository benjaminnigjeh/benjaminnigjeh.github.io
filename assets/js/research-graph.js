// Force-directed "Research Ecosystem" graph. D3 is lazy-loaded from a
// pinned CDN build (ESM) only once #research-ecosystem scrolls into view,
// so the ~80KB dependency never blocks first paint.
const NODES = [
  { id: 'Benjamin Nigjeh', center: true },
  { id: 'AI' }, { id: 'Machine Learning' }, { id: 'Deep Learning' },
  { id: 'Mass Spectrometry' }, { id: 'Proteomics' }, { id: 'Bioinformatics' },
  { id: 'Protein Language Models' }, { id: 'Cloud Computing' },
  { id: 'Distributed Systems' }, { id: 'Docker' }, { id: 'Kubernetes' },
  { id: 'FastAPI' }, { id: 'Python' }, { id: 'LLMs' },
  { id: 'Multi-Agent Systems' }, { id: 'Scientific Software' }, { id: 'Graph Theory' },
];

const HUB = 'Benjamin Nigjeh';

const LINKS = [
  ...NODES.filter((n) => n.id !== HUB).map((n) => ({ source: HUB, target: n.id })),
  // A few secondary edges so the graph reads as an ecosystem, not just a star.
  { source: 'AI', target: 'Machine Learning' },
  { source: 'Machine Learning', target: 'Deep Learning' },
  { source: 'Deep Learning', target: 'Protein Language Models' },
  { source: 'AI', target: 'LLMs' },
  { source: 'LLMs', target: 'Multi-Agent Systems' },
  { source: 'Mass Spectrometry', target: 'Proteomics' },
  { source: 'Proteomics', target: 'Bioinformatics' },
  { source: 'Bioinformatics', target: 'Graph Theory' },
  { source: 'Cloud Computing', target: 'Distributed Systems' },
  { source: 'Docker', target: 'Kubernetes' },
  { source: 'Kubernetes', target: 'Cloud Computing' },
  { source: 'Python', target: 'FastAPI' },
  { source: 'Python', target: 'Machine Learning' },
  { source: 'Scientific Software', target: 'Python' },
];

export function initResearchGraph(containerId) {
  const container = document.getElementById(containerId);
  if (!container || !('IntersectionObserver' in window)) return;

  let started = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          build(container);
          observer.disconnect();
        }
      });
    },
    { rootMargin: '200px' }
  );
  observer.observe(container);
}

async function build(container) {
  let d3;
  try {
    d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
  } catch (e) {
    container.innerHTML =
      '<p class="ecosystem-noscript">Interactive graph unavailable offline — see the AI &amp; ML topics listed elsewhere on this page.</p>';
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const svg = d3.select(container).append('svg').attr('viewBox', `0 0 ${width} ${height}`);

  const defs = svg.append('defs');
  const gradient = defs.append('radialGradient').attr('id', 'eco-center-gradient');
  gradient.append('stop').attr('offset', '0%').attr('stop-color', 'var(--accent)');
  gradient.append('stop').attr('offset', '100%').attr('stop-color', 'var(--accent-2)');

  const nodes = NODES.map((d) => ({ ...d }));
  const links = LINKS.map((d) => ({ ...d }));

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id).distance((d) => (d.source.center || d.target.center ? 150 : 70)))
    .force('charge', d3.forceManyBody().strength(-190))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(38));

  const link = svg
    .append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'eco-link');

  const node = svg
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', (d) => `eco-node${d.center ? ' is-center' : ''}`)
    .call(dragBehavior(simulation));

  node.append('circle').attr('r', (d) => (d.center ? 34 : 20));

  node
    .append('text')
    .text((d) => d.id)
    .attr('text-anchor', 'middle')
    .attr('dy', (d) => (d.center ? 4 : 34));

  node.on('mouseenter focus', (event, d) => highlight(d)).on('mouseleave blur', clearHighlight);
  node.attr('tabindex', 0).attr('role', 'button').append('title').text((d) => d.id);

  function highlight(d) {
    const connected = new Set([d.id]);
    links.forEach((l) => {
      if (l.source.id === d.id) connected.add(l.target.id);
      if (l.target.id === d.id) connected.add(l.source.id);
    });
    node.classed('is-dim', (n) => !connected.has(n.id));
    node.classed('is-active', (n) => connected.has(n.id) && n.id !== d.id);
    link.classed('is-dim', (l) => l.source.id !== d.id && l.target.id !== d.id);
    link.classed('is-active', (l) => l.source.id === d.id || l.target.id === d.id);
  }

  function clearHighlight() {
    node.classed('is-dim', false).classed('is-active', false);
    link.classed('is-dim', false).classed('is-active', false);
  }

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);
    node.attr('transform', (d) => `translate(${d.x},${d.y})`);
  });

  if (reduceMotion) {
    simulation.stop();
    for (let i = 0; i < 300; i++) simulation.tick();
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);
    node.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  function dragBehavior(sim) {
    function started(event, d) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function ended(event, d) {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag().on('start', started).on('drag', dragged).on('end', ended);
  }
}
